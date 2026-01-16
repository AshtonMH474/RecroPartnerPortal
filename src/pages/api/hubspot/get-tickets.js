import { authenticateUser } from '@/lib/authMiddleware';
import axios from 'axios';

const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL || 'https://api.hubapi.com';
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const hubspotID = auth.user.hubspotID;
    if (!hubspotID) return res.status(400).json({ error: 'Missing hubspotID in query' });

    // 🔹 Step 1: Get all associated ticket IDs for this contact
    const associationsRes = await axios.get(
      `${HUBSPOT_API_URL}/crm/v4/objects/contacts/${hubspotID}/associations/tickets`,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const ticketAssociations = associationsRes.data.results || [];
    const ticketIds = ticketAssociations.map((assoc) => assoc.toObjectId);

    if (ticketIds.length === 0) {
      return res.status(200).json({ success: true, tickets: [] });
    }

    // 🔹 Step 2: Fetch full ticket details (Batch Read)
    const ticketsRes = await axios.post(
      `${HUBSPOT_API_URL}/crm/v3/objects/tickets/batch/read`,
      {
        properties: [
          'subject',
          'agency',
          'amount',
          'content',
          'hs_pipeline',
          'hs_pipeline_stage',
          'createdate',
        ],
        inputs: ticketIds.map((id) => ({ id })),
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      success: true,
      tickets: ticketsRes.data.results,
    });
  } catch {
    console.error('HubSpot fetch tickets error');
    return res.status(500).json({ error: 'Failed to fetch tickets from HubSpot' });
  }
}
