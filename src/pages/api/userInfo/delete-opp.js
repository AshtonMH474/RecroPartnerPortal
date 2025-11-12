import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, filename } = req.body;

    if (!email || !filename) {
      return res
        .status(400)
        .json({ error: "Missing email or filename (relativePath)" });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    // Find the user
    const mongoUser = await db.collection("users").findOne({ email });
    if (!mongoUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the saved opportunity
    const result = await db.collection("users_opportunites").deleteOne({
      userId: mongoUser._id,
      relativePath: filename,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Opportunity not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Opportunity successfully deleted" });
  } catch (e) {
    console.error("Error deleting opportunity:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
