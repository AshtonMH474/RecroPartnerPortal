

// pages/api/auth/me.js
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = req.cookies;
  let accessToken = cookies.token;
  const refreshToken = cookies.refresh_token;

  try {
    // 1️⃣ Try to verify access token
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        
        // Fetch user from DB
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const dbUser = await db.collection('users').findOne({ email: decoded.email });
    
        if (!dbUser) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const user = {
          ...decoded,
          hubspotID: dbUser.hubspotContactId,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          organization: dbUser.organization,
          interests: dbUser?.interests
        };

        return res.status(200).json({ user });
      } catch (err) {
        console.log("Access token expired:", err.message);
        accessToken = null; // Token expired, try refresh
      }
    }

    // 2️⃣ Try to refresh token if access token invalid/expired
    if (!accessToken && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Fetch user from DB using refresh token data
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME);
        const dbUser = await db.collection('users').findOne({ email: decodedRefresh.email });

        if (!dbUser) {
          throw new Error("User not found");
        }

        // Issue new access token
        const newAccessToken = jwt.sign(
          { 
            id: decodedRefresh.id,
            email: decodedRefresh.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set new access token cookie
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
          })
        );

        const user = {
          id: decodedRefresh.id,
          email: decodedRefresh.email,
          hubspotID: dbUser.hubspotContactId,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          organization: dbUser.organization,
          interests: dbUser?.interests
        };

        console.log("🔄 Token refreshed successfully");
        return res.status(200).json({ user, tokenRefreshed: true });
      } catch (err) {
        console.error("❌ Refresh token invalid:", err.message);
        
        // Clear both cookies
        res.setHeader(
          "Set-Cookie",
          [
            cookie.serialize("token", "", { maxAge: -1, path: "/" }),
            cookie.serialize("refresh_token", "", { maxAge: -1, path: "/" }),
          ]
        );
        
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    // 3️⃣ No tokens available
    return res.status(401).json({ error: 'Unauthorized' });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}