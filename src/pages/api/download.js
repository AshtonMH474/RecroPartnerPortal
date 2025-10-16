import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, pdfUrl, type, relativePath } = req.body;

    if (!email || !pdfUrl || !type || !relativePath) {
      return res
        .status(400)
        .json({ error: "Missing email, pdfUrl, type, or relativePath" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    // Verify user exists
    const mongoUser = await db.collection("users").findOne({ email });
    if (!mongoUser) {
      return res.status(401).json({ error: "No user found" });
    }

    // Check if user already downloaded this file
    const existingDownload = await db.collection("downloads").findOne({
      userId: mongoUser._id,
      relativePath,
    });

    if (existingDownload) {
      // Update the existing record's timestamp
      await db.collection("downloads").updateOne(
        { _id: existingDownload._id },
        {
          $set: {
            downloadedAt: new Date(),
          },
        }
      );

      return res
        .status(200)
        .json({ success: true, message: "Download timestamp updated" });
    }

    // Otherwise, insert a new download record
    await db.collection("downloads").insertOne({
      userId: mongoUser._id,
      email,
      pdfUrl,
      type,
      relativePath,
      downloadedAt: new Date(),
    });

    return res
      .status(200)
      .json({ success: true, message: "Download tracked successfully" });
  } catch (error) {
    console.error("Error tracking download:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
