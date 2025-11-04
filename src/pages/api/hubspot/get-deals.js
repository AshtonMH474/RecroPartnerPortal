// pages/api/deals/byContact.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { hubspotID } = req.query;
    if (!hubspotID) {
      return res.status(400).json({ error: "Missing hubspotID" });
    }

    const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_TOKEN;

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

    // ✅ The correct property is `toObjectId`
    const dealIds = associatedDeals.map((a) => a.toObjectId).filter(Boolean);

    if (dealIds.length === 0) {
      return res.status(200).json({ deals: [] });
    }

    // 2️⃣ Fetch full deal details
    const dealsRes = await axios.post(
      `https://api.hubapi.com/crm/v3/objects/deals/batch/read`,
      {
        properties: [
          "dealname",
          "amount",
          "dealstage",
          "pipeline",
          "closedate",
          "hs_lastmodifieddate",
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
      name: d.properties.dealname,
      amount: d.properties.amount,
      stage: d.properties.dealstage,
      pipeline: d.properties.pipeline,
      closeDate: d.properties.closedate,
      lastUpdated: d.properties.hs_lastmodifieddate,
    }));

    res.status(200).json({ deals });
  } catch (error) {
    console.error("Error fetching deals:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch deals",
      details: error.response?.data || error.message,
    });
  }
}
