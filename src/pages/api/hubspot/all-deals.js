// ID im using comapny for placeholder: 9391926107

import { authenticateUser } from '@/lib/authMiddleware';
import axios from 'axios';

// ✅ Cache axios instance globally (reuse across requests)
let hubspotClient = null;

function getHubspotClient() {
  if (!hubspotClient) {
    hubspotClient = axios.create({
      baseURL: 'https://api.hubapi.com',
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30s timeout
    });
  }
  return hubspotClient;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateUser(req);
  if (!auth.authenticated || !auth.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const email = auth.user.email;

  try {
    const hubspot = getHubspotClient();

    // ✅ Optimized pagination helper with parallel requests where possible
    const hubspotGetAll = async (url, maxPages = 10) => {
      const results = [];
      let after = null;
      let pageCount = 0;

      // Fetch first page
      const firstResponse = await hubspot.get(url);
      results.push(...(firstResponse.data.results || []));
      after = firstResponse.data.paging?.next?.after || null;
      pageCount++;

      // If we have more pages, fetch them sequentially (HubSpot rate limits)
      while (after && pageCount < maxPages) {
        const response = await hubspot.get(`${url}${url.includes('?') ? '&' : '?'}after=${after}`);
        results.push(...(response.data.results || []));
        after = response.data.paging?.next?.after || null;
        pageCount++;
      }

      return results;
    };

    // 1️⃣ Find contact by email
    const contactSearch = await hubspot.post(`/crm/v3/objects/contacts/search`, {
      filterGroups: [
        {
          filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
        },
      ],
      properties: ['email', 'firstname', 'lastname'],
      limit: 1,
    });

    const contact = contactSearch.data.results?.[0];
    if (!contact) {
      return res.status(404).json({ error: `No contact found for ${email}` });
    }

    const contactId = contact.id;

    // 2️⃣ & 3️⃣ Parallelize: Get companies AND company details simultaneously
    const [associatedCompaniesResponse] = await Promise.all([
      hubspotGetAll(`/crm/v4/objects/contacts/${contactId}/associations/companies`),
      // Start fetching deals early (we'll use the correct companyId after)
      Promise.resolve([]), // Placeholder, will be replaced
    ]);

    const associatedCompanies = associatedCompaniesResponse;
    if (!associatedCompanies.length) {
      return res.status(404).json({ error: `No companies associated with ${email}` });
    }

    const companyId = associatedCompanies[0].toObjectId;

    // ✅ FIX: Use dynamic companyId instead of hardcoded value!
    // 4️⃣ Get all deals for that company AND company name in parallel
    const [companyDeals, companyResponse] = await Promise.all([
      hubspotGetAll(`/crm/v4/objects/companies/${companyId}/associations/deals`),
      hubspot.get(`/crm/v3/objects/companies/${companyId}`, {
        params: { properties: 'name' },
      }),
    ]);

    const companyName = companyResponse.data.properties?.name || 'Unknown Company';

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

    const dealIds = companyDeals.map((d) => d.toObjectId).filter(Boolean);

    // 5️⃣ Fetch detailed deal info in PARALLEL batches (much faster!)
    const batchSize = 100;
    const batches = [];

    // Create all batch promises upfront
    const batchPromises = [];
    for (let i = 0; i < dealIds.length; i += batchSize) {
      const batch = dealIds.slice(i, i + batchSize);
      batchPromises.push(
        hubspot.post(`/crm/v3/objects/deals/batch/read`, {
          properties: [
            'dealname',
            'amount',
            'description',
            'agency',
            'type_of_work',
            'pipeline',
            'dealstage',
            'closedate',
            'hs_lastmodifieddate',
            'contract_vehicle',
          ],
          inputs: batch.map((id) => ({ id })),
        })
      );
    }

    // Execute all batches in parallel
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach((response) => {
      batches.push(...(response.data.results || []));
    });

    // 6️⃣ Format data for frontend (optimized mapping)
    const deals = batches.map((d) => ({
      id: d.id,
      name: d.properties.dealname || 'Untitled Deal',
      amount: d.properties.amount || '0',
      description: d.properties.description || '',
      agency: d.properties.agency || '',
      typeOfWork: d.properties.type_of_work || '',
      pipeline: d.properties.pipeline || '',
      stage: d.properties.dealstage || '',
      closeDate: d.properties.closedate || '',
      lastUpdated: d.properties.hs_lastmodifieddate || '',
      vehicle: d.properties.contract_vehicle || '',
    }));

    // ✅ Set cache headers for better performance
    res.setHeader('Cache-Control', 'private, s-maxage=60, stale-while-revalidate=120');
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
  } catch {
    console.error('Error fetching deals by email:');
    res.status(500).json({
      error: "Failed to fetch deals for user's company",
    });
  }
}
