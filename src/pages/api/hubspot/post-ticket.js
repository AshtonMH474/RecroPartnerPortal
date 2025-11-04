import axios from "axios";

const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL || "https://api.hubapi.com";
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { opportunity, user } = req.body;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    
    const contactId = user.hubspotID;
    if (!contactId)
      return res.status(400).json({ error: "User does not have a HubSpot contact ID" });

    // Extract opportunity details
    const subject = opportunity.title;
    const filename = opportunity?._sys?.relativePath || "";
    const partner_email = user?.email || "";
    const description = extractText(opportunity.description);
    const location = opportunity?.location || "";
    const agency = opportunity?.agency || "";
    const type = opportunity?.type || "";
    const category = opportunity?.category?.category || "";
    const icon_name = opportunity?.category?.icon || "";
    const estValue = opportunity?.value || 0;
    const program = opportunity?.program || "";
    const samlink = opportunity?.samLink || "";
    const vehicle = opportunity?.vehicle || "";



    

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
      // Batch read tickets to check for duplicates
      const ticketsRes = await axios.post(
        `${HUBSPOT_API_URL}/crm/v3/objects/tickets/batch/read`,
        {
          properties: ["filename", "partner_email"],
          inputs: ticketIds.map((id) => ({ id })),
        },
        {
          headers: {
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Compare by subject + filename + partner_email to detect duplicates
      duplicateFound = ticketsRes.data.results.some((t) => {
        const props = t.properties || {};
        return (
          props.partner_email === partner_email &&
          (props.filename === filename || props.subject === subject)
        );
      });
    }

    if (duplicateFound) {
      return res.status(200).json({
        success: false,
        message: "Opportunity already exists for this contact",
      });
    }

    // 1️⃣ Create ticket
    const ticketData = {
      properties: {
        subject,
        content: description || "",
        hs_pipeline: "0", // update with your actual pipeline ID
        hs_pipeline_stage: "1", // update with your actual stage ID
        filename,
        partner_email,
        amount: estValue,
        location,
        agency,
        type,
        category,
        iconname: icon_name,
        // program,
        // samlink,
        // vehicle,
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

    return res.status(200).json({
      success: true,
      message: "Opportunity created and associated with contact",
    });
  } catch (error) {
    console.error("HubSpot ticket error:", {
      message: error.message,
      details: error.response?.data,
    });
    return res
      .status(500)
      .json({ error: "Failed to create or associate ticket in HubSpot" });
  }
}

function extractText(node) {
  if (!node) return "";
  if (node.text) return node.text;
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join(" ");
  }
  return "";
}
