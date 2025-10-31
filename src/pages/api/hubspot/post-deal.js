import axios from "axios";


const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL || "https://api.hubapi.com";
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { opportunity, user } = req.body;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // Extract fields
    const subject = opportunity.title;
    const filename = opportunity?._sys?.relativePath;
    const partner_email = user?.email;
    const description = extractText(opportunity.description);
    const location = opportunity?.location || "";
    const agency = opportunity?.agency || "";
    const type = opportunity?.type || "";
    const category = opportunity?.category?.category || "";
    const icon_name = opportunity?.category?.iconName || "";
    const estValue = opportunity?.value || 0;

    // Prepare ticket payload
const ticketData = {
  properties: {
    // Required HubSpot ticket fields
    subject: subject,                   // Title of the ticket
    content: description || "",         // Main body / description of the ticket
    hs_pipeline: "0",                   // Replace with your pipeline ID
    hs_pipeline_stage: "1",             // Replace with your initial stage ID

    // Optional / custom fields
    filename: filename || "",
    partner_email: partner_email || "",
    amount: estValue || 0,
    location: location || "",
    agency: agency || "",
    type: type || "",
    category: category || "",
    iconname: icon_name || "",
    // status: "new",                       // Default status for new tickets
  },
};

    await axios.post(`${HUBSPOT_API_URL}/crm/v3/objects/tickets`, ticketData, {
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({ success: true, message: "Ticket created in HubSpot" });
  } catch (error) {
    console.error("HubSpot ticket error:", {
      message: error.message,
      details: error.response?.data,
    });
    return res.status(500).json({ error: "Failed to create ticket in HubSpot" });
  }
}


function extractText(node) {
  if (!node) return "";

  // If node has a "text" property, return it
  if (node.text) return node.text;

  // If node has children, recursively extract their text
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join(" ");
  }

  return "";
}