
// ID im using comapny for placeholder: 9391926107
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Missing required 'email' query parameter" });
  }

  try {
    const HUBSPOT_ACCESS_TOKEN = process.env.RECRO_HUBSPOT_TOKEN;

    const hubspot = axios.create({
      baseURL: "https://api.hubapi.com",
      headers: {
        Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    // 🔁 Helper to fetch all pages
    const hubspotGetAll = async (url) => {
      let results = [];
      let after = null;
      do {
        const response = await hubspot.get(`${url}${after ? `?after=${after}` : ""}`);
        results = results.concat(response.data.results || []);
        after = response.data.paging?.next?.after || null;
      } while (after);
      return results;
    };

    // 1️⃣ Find contact by email
    const contactSearch = await hubspot.post(`/crm/v3/objects/contacts/search`, {
      filterGroups: [
        {
          filters: [{ propertyName: "email", operator: "EQ", value: email }],
        },
      ],
      properties: ["email", "firstname", "lastname"],
      limit: 1,
    });

    const contact = contactSearch.data.results?.[0];
    if (!contact) {
      return res.status(404).json({ error: `No contact found for ${email}` });
    }

    const contactId = contact.id;
    console.log(`Found contact ${contact.properties.firstname} (${email}) → ID ${contactId}`);

    // 2️⃣ Get the company associated with that contact
    const associatedCompanies = await hubspotGetAll(
      `/crm/v4/objects/contacts/${contactId}/associations/companies`
    );

    if (!associatedCompanies.length) {
      return res.status(404).json({ error: `No companies associated with ${email}` });
    }

    const companyId = associatedCompanies[0].toObjectId; // use first associated company
    console.log(`Associated company ID: ${companyId}`);

    // 3️⃣ Fetch the company name
    const companyResponse = await hubspot.get(`/crm/v3/objects/companies/${companyId}`, {
      params: { properties: "name" },
    });
    const companyName = companyResponse.data.properties?.name || "Unknown Company";
    console.log(`Associated company name: ${companyName}`);

    // 4️⃣ Get all deals for that company
    const companyDeals = await hubspotGetAll(
      `/crm/v4/objects/companies/9391926107/associations/deals`
    );

    if (!companyDeals.length) {
      return res.status(200).json({
        user: {
          name: `${contact.properties.firstname} ${contact.properties.lastname}`.trim(),
          email,
        },
        company: { id: companyId, name: companyName },
        total: 0,
        deals: [],
      });
    }

    const dealIds = companyDeals.map((d) => d.toObjectId);

    // 5️⃣ Fetch detailed deal info in batches of 100
    const batchSize = 100;
    const batches = [];
    for (let i = 0; i < dealIds.length; i += batchSize) {
      const batch = dealIds.slice(i, i + batchSize);
      const batchRes = await hubspot.post(`/crm/v3/objects/deals/batch/read`, {
        properties: [
          "dealname",
          "amount",
          "description",
          "agency",
          "type_of_work",
          "pipeline",
          "dealstage",
          "closedate",
          "hs_lastmodifieddate",
          "contract_vehicle",
        ],
        inputs: batch.map((id) => ({ id })),
      });
      batches.push(...batchRes.data.results);
    }

    // 6️⃣ Format data for frontend
    const deals = batches.map((d) => ({
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
      vehicle: d.properties.contract_vehicle || "",
    }));

    res.status(200).json({
      user: {
        name: `${contact.properties.firstname} ${contact.properties.lastname}`.trim(),
        email,
      },
      company: {
        id: companyId,
        name: companyName,
      },
      total: deals.length,
      deals,
    });
  } catch (error) {
    console.error("Error fetching deals by email:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch deals for user's company",
      details: error.response?.data || error.message,
    });
  }
}

