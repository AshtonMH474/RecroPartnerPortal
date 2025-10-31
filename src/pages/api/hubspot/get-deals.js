import axios from "axios";

const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL || "https://api.hubapi.com";
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // Expect partner email as a query param: ?email=partner@example.com
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing partner email" });

    const searchPayload = {
      filterGroups: [
        {
          filters: [
            { propertyName: "partner_email", operator: "EQ", value: email },
          ],
        },
      ],
      properties: [
        "dealname",
        "filename",
        "partner_email",
        "closedate",
        "amount",
        "dealstage",
        "pipeline",
      ],
      limit: 100, // adjust as needed
    };

    const response = await axios.post(
      `${HUBSPOT_API_URL}/crm/v3/objects/deals/search`,
      searchPayload,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ deals: response.data.results });
  } catch (error) {
    console.error("HubSpot fetch deals error:", error.response?.data || error);
    return res.status(500).json({ error: "Failed to fetch deals from HubSpot" });
  }
}
