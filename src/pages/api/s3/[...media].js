import {
  createMediaHandler,
} from "next-tinacms-s3/dist/handlers";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import cookie from "cookie";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createMediaHandler({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET || "",
  authorized: async (req, _res) => {
    if (process.env.TINA_PUBLIC_IS_LOCAL === "true") {
      console.log("✅ Local mode: always authorized");
      return true;
    }

    const ok = await isAuthorized(req);
    console.log("🔑 Authorized check:", req.method, ok);
    return ok;
  },
});

const client = new JwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

async function isAuthorized(req) {
  // 1️⃣ Try header (for Tina/Google)
  const authHeader = req.headers.authorization;
  let token = authHeader?.replace("Bearer ", "");

  // 2️⃣ If no header token, try cookie
  if (!token && req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.token; // your portal's auth cookie
  }

  if (!token) return false;

  try {
    // 3️⃣ Try verifying as Google JWT (RS256)
    return await new Promise((resolve) => {
      jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (!err && decoded) {
          console.log("✅ Verified RS256 (Google) token");
          return resolve(true);
        }

        // 4️⃣ If that fails, try verifying as local HS256 JWT
        try {
          const decodedLocal = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
          });
          if (decodedLocal) {
            console.log("✅ Verified HS256 (local) cookie token");
            return resolve(true);
          }
        } catch {
          console.error("❌ Both RS256 and HS256 verification failed");
        }

        resolve(false);
      });
    });
  } catch (e) {
    console.error("JWT verification error:", e);
    return false;
  }
}
