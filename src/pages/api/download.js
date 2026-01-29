import { authenticateUser } from '@/lib/authMiddleware';
import { withCsrfProtection } from '@/lib/csrfMiddleware';
import clientPromise from '@/lib/mongodb';
import { sanitizeDownloadData } from '@/lib/sanitize';

// Ensure index exists once at module load, not per request
let indexCreated = false;
async function ensureIndex(db) {
  if (indexCreated) return;
  try {
    await db
      .collection('downloads')
      .createIndex(
        { userId: 1, relativePath: 1 },
        { unique: true, name: 'userId_relativePath_idx' }
      );
  } catch (error) {
    if (error.code !== 85 && error.code !== 86) {
      console.warn('Index creation warning:', error.message);
    }
  }
  indexCreated = true;
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated || !auth.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const email = auth.user.email;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    // Validate and sanitize input
    const result = sanitizeDownloadData(req.body);
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }

    const { pdfUrl, type, relativePath } = result.data;

    if (!pdfUrl || !type || !relativePath) {
      return res.status(400).json({ error: 'Missing pdfUrl, type, or relativePath' });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    await ensureIndex(db);

    // Verify user exists
    const mongoUser = await db.collection('users').findOne({ email });
    if (!mongoUser) {
      return res.status(401).json({ error: 'No user found' });
    }

    // Check if user already downloaded this file
    const existingDownload = await db.collection('downloads').findOne({
      userId: mongoUser._id,
      relativePath,
    });

    if (existingDownload) {
      // Update the existing record's timestamp
      await db.collection('downloads').updateOne(
        { _id: existingDownload._id },
        {
          $set: {
            downloadedAt: new Date(),
          },
        }
      );

      return res.status(201).json({ success: true, message: 'Download timestamp updated' });
    }

    // Otherwise, insert a new download record
    await db.collection('downloads').insertOne({
      userId: mongoUser._id,
      email,
      pdfUrl,
      type,
      relativePath,
      downloadedAt: new Date(),
    });

    return res.status(200).json({ success: true, message: 'Download tracked successfully' });
  } catch (error) {
    console.error('Error tracking download:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withCsrfProtection(handler);
