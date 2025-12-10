import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

/**
 * Authentication Middleware
 *
 * This function verifies that a user is authenticated by checking their JWT token.
 * It's used by API routes to ensure only logged-in users can access protected data.
 *
 * @param {Object} req - Next.js API request object
 * @returns {Object} Authentication result with user data or error
 *
 * @example
 * // In your API route:
 * import { authenticateUser } from "@/lib/authMiddleware";
 *
 * export default async function handler(req, res) {
 *   const auth = await authenticateUser(req);
 *   if (!auth.authenticated) {
 *     return res.status(401).json({ error: auth.error });
 *   }
 *
 *   // Now you can use auth.user safely
 *   const userEmail = auth.user.email;
 *   const hubspotID = auth.user.hubspotID;
 * }
 */
export async function authenticateUser(req) {
  try {
    // 1️⃣ Extract JWT token from cookies
    const cookies = req.cookies;
    const accessToken = cookies.token;

    // No token = user is not logged in
    if (!accessToken) {
      return {
        authenticated: false,
        error: "No authentication token provided. Please log in."
      };
    }

    // 2️⃣ Verify JWT token is valid and not expired
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Token is invalid or expired
      if (jwtError.name === "TokenExpiredError") {
        return {
          authenticated: false,
          error: "Your session has expired. Please log in again."
        };
      }
      return {
        authenticated: false,
        error: "Invalid authentication token. Please log in again."
      };
    }

    // 3️⃣ Fetch user from database to ensure they still exist and are verified
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    const user = await db.collection("users").findOne({ email: decoded.email });

    // User not found in database (deleted account)
    if (!user) {
      return {
        authenticated: false,
        error: "User account not found. Please contact support."
      };
    }

    // User exists but hasn't verified their email yet
    if (!user.verified) {
      return {
        authenticated: false,
        error: "Email not verified. Please check your email to verify your account."
      };
    }

    // 4️⃣ Success! Return user data for the API route to use
    return {
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        hubspotID: user.hubspotContactId,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        interests: user.interests || [],
      },
    };

  } catch (error) {
    // Unexpected error (database connection issue, etc.)
    console.error("[authMiddleware] Unexpected error:", error.message);
    return {
      authenticated: false,
      error: "Authentication failed. Please try again."
    };
  }
}
