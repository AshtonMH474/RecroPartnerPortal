import clientPromise from "@/lib/mongodb";
import { withCsrfProtection } from "@/lib/csrfMiddleware";
import { sanitizeProfileData, isValidEmail } from "@/lib/sanitize";

 async function handler(req,res) {
    if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try{
    // Validate and sanitize input
    const result = sanitizeProfileData(req.body);
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }

    const { email, firstName, lastName, interests } = result.data;

    if (!email || !firstName || !lastName || !interests) {
      return res
        .status(400)
        .json({ error: "Missing email, first name, last name, or interests" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    const mongoUser = await db.collection("users").findOne({ email });
    if (!mongoUser) {
      return res.status(401).json({ error: "No user found" });
    }

    await db.collection("users").updateOne(
    { _id: mongoUser._id },
    {
        $set: {
        firstName: firstName,
        lastName: lastName,
        ...(interests && { interests }),
        }
    },
    );

    return res.status(200).json({success:true})

  }catch(error){
    console.error("Error tracking download:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withCsrfProtection(handler);