import axios from "axios";
import clientPromise from "@/lib/mongodb";
import { authenticateUser } from "@/lib/authMiddleware";
import { withCsrfProtection } from "@/lib/csrfMiddleware";

const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL || "https://api.hubapi.com";
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { deal } = req.body;
    const auth = await authenticateUser(req)
    const user = auth.user;
    if (!user || !auth.authenticated) return res.status(401).json({ error: "Unauthorized" });
    const contactId = user.hubspotID;
    if (!contactId)
      return res.status(400).json({ error: "User does not have a HubSpot contact ID" });

    // Extract opportunity details
    const subject = deal?.subject;
    const description = deal?.description;
    const agency = deal?.agency || "";
    const rawAmount = deal?.amount || 0;
    
    const program = deal?.program || "";
    const solicitationLink = deal?.solicitationLink || "";
    const vehicle = deal?.vehicle || "";
    const amount = typeof rawAmount === "string"
    ? parseFloat(rawAmount.replace(/,/g, ""))
    : Number(rawAmount);

    // Validate
   
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    if (
    typeof subject !== "string" ||
    typeof description !== "string" ||
    subject.trim().length === 0 ||
    description.trim().length === 0 ||
    amount === 0){
      return res.status(400).json({error:'Not all required fields were filled out'})
    }


    const optionalFields = {
      agency,
      program,
      solicitationLink,
      vehicle,
    };

  for (const [key, value] of Object.entries(optionalFields)) {
    if (value !== "" && typeof value !== "string") {
      return res.status(400).json({ error: `${key} must be a string` });
    }
  }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    
    const mongoUser = await db.collection("users").findOne({ email:user?.email });
    if (!mongoUser) {
        return res.status(401).json({ error: "No user found" });
    }

    const existingOpp = await db.collection("users_deals").findOne({
            userId: mongoUser._id,
            hubspotID:mongoUser.hubspotID,
            subject:subject,
    
    });
    if (existingOpp) {
        
        await db.collection("users_deals").updateOne(
            { _id: existingOpp._id },
            {
            $set: {
                 subject:subject,
                  description: description,
                  amount: amount,
                  agency: agency,
                  program: program,
                  solicitationLink: solicitationLink,
                  vehicle: vehicle,
            },
            }
        );
      }
    // 1️⃣ Get all ticket associations for this contact
        const associationsRes = await axios.get(
          `${HUBSPOT_API_URL}/crm/v4/objects/contacts/${contactId}/associations/tickets`,
          {
            headers: {
              Authorization: `Bearer ${HUBSPOT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const ticketAssociations = associationsRes.data.results || [];
        const ticketIds = ticketAssociations.map((assoc) => assoc.toObjectId);

        let duplicateFound = false;

        if (ticketIds.length > 0) {
          // 2️⃣ Batch read tickets to get their properties
          const ticketsRes = await axios.post(
            `${HUBSPOT_API_URL}/crm/v3/objects/tickets/batch/read`,
            {
              properties: ["subject"], // read the fields you need
              inputs: ticketIds.map((id) => ({ id })),
            },
            {
              headers: {
                Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          // 3️⃣ Check if any ticket has the same subject AND same email
          duplicateFound = ticketsRes.data.results.some((t) => {
            const props = t.properties || {};
            return (
              props.subject.toLowerCase() === subject.toLowerCase()     // ticket subject matches
            );
          });
        }

        if (duplicateFound) {
          return res.status(200).json({
            success: false,
            message: "Deal already exists for this contact",
          });
        }
    // 1️⃣ Create ticket
    const ticketData = {
      properties: {
        subject,
        content: description || "",
        hs_pipeline: "0", // update with your actual pipeline ID
        hs_pipeline_stage: "1", // update with your actual stage ID
        amount: amount,
        agency,
        program,
        solicitation_url:solicitationLink,
        contract_vehicle:vehicle,
         source_type: "FORM",
        hs_ticket_priority: "MEDIUM"
      },
    };

    const createTicketResponse = await axios.post(
      `${HUBSPOT_API_URL}/crm/v3/objects/tickets`,
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const ticketId = createTicketResponse.data.id;

    // 2️⃣ Associate the ticket with the contact
    await axios.put(
  `${HUBSPOT_API_URL}/crm/v3/objects/tickets/${ticketId}/associations/contact/${contactId}/16`,
  {},
  {
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      "Content-Type": "application/json",
    },
  }
);

    // 3️⃣ Save to MongoDB
    await db.collection("users_deals").insertOne({
      userId: mongoUser._id,
      hubspotID: mongoUser.hubspotID,
      ticketId: ticketId, // HubSpot ticket ID for reference
      subject: subject,
      description: description,
      amount: amount,
      agency: agency,
      program: program,
      solicitationLink: solicitationLink,
      vehicle: vehicle,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Opportunity created and associated with contact",
    });
  } catch (error) {
    console.error("HubSpot ticket error:");
    return res
      .status(500)
      .json({ error: "Failed to create or associate ticket in HubSpot" });
  }
}

// Export with CSRF protection
export default withCsrfProtection(handler);

