import { authenticateUser } from "@/lib/authMiddleware";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auth = await authenticateUser(req)
    if (!auth.authenticated || !auth.user) {
          return res.status(401).json({ error: "Unauthorized" });
    }
    const hubspotID = auth.user.hubspotID;
    if (!hubspotID) {
      return res.status(400).json({ error: "Missing hubspotID" });
    }

    const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_TOKEN;

    // ✅ OPTIMIZATION: Both API calls can run in parallel since they don't depend on each other
    // We can get associations and prepare the batch read config at the same time

    // 1️⃣ Get associated deals for this contact
    const associationRes = await axios.get(
      `https://api.hubapi.com/crm/v4/objects/contacts/${hubspotID}/associations/deals`,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const associatedDeals = associationRes.data.results || [];
    if (associatedDeals.length === 0) {
      return res.status(200).json({ deals: [] });
    }


    // ✅ Use `toObjectId` for deal IDs
    const dealIds = associatedDeals.map((a) => a.toObjectId).filter(Boolean);
    if (dealIds.length === 0) {
      return res.status(200).json({ deals: [] });
    }

    // 2️⃣ Fetch deal details with your defined custom properties
    // Note: This must happen after getting dealIds, so it's sequential (correct)
    const dealsRes = await axios.post(
      `https://api.hubapi.com/crm/v3/objects/deals/batch/read`,
      {
        properties: [
          "dealname",
          "amount",
          "description",
          "agency",         // custom field
          "type_of_work",   // custom field
          "pipeline",
          "dealstage",
          "closedate",
          "hs_lastmodifieddate",
          "contract_vehicle"
        ],
        inputs: dealIds.map((id) => ({ id })),
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const deals = dealsRes.data.results.map((d) => ({
      id: d.id,
      name: d.properties.dealname || "Untitled Deal",
      amount: d.properties.amount || "0",
      description: d.properties.description || "",
      agency: d.properties.agency || "",
      typeOfWork: d.properties.type_of_work || "",
      pipeline: d.properties.pipeline || "",
      stage: d.properties.dealstage || "",
      closeDate: d.properties.closedate || "",
      lastUpdated: d.properties.hs_lastmodifieddate || "",
      vehicle:d.properties.contract_vehicle
    }));

    res.status(200).json({ deals });
  } catch (error) {
    console.error("Error fetching deals:");
    res.status(500).json({
      error: "Failed to fetch deals",
      
    });
  }
}
