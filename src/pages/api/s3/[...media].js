import {
    createMediaHandler,
  } from 'next-tinacms-s3/dist/handlers';
  import jwt from 'jsonwebtoken';
  import { JwksClient } from "jwks-rsa";
  
  export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default createMediaHandler({
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
      region: process.env.S3_REGION,
    },
    bucket: process.env.S3_BUCKET || '',
    authorized: async (req, _res) => {
      if (process.env.TINA_PUBLIC_IS_LOCAL=== 'true') {
        console.log("✅ Local mode: always authorized");
        return true;
      }
      const ok = await isAuthorized(req);
    console.log("🔑 Authorized check:", req.method, ok);
    return ok;
    },
  });




    const client = new JwksClient({
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    });
    function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
    }

  async function isAuthorized(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) return false;

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    // Optional: Check specific claim like email/domain/etc
    return Boolean(decoded);
  } catch (e) {
    console.error('JWT verification failed:', e);
    return false;
  }
}