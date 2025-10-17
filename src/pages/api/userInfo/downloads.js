import clientPromise from "@/lib/mongodb";
import databaseClient from "../../../../tina/__generated__/databaseClient";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const dbclient = await clientPromise;
    const db = dbclient.db("mydb");

    // Check user exists
    const mongoUser = await db.collection("users").findOne({ email });
    if (!mongoUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch downloads for that user
    const downloads = await db
      .collection("downloads")
      .find({ userId: mongoUser._id })
      .sort({ downloadedAt: -1 }) // newest first
      .toArray();


    const content = await Promise.all(
  downloads
    .filter(dl => dl?.relativePath && ["Paper", "Sheet"].includes(dl?.type))
    .map(async (dl) => {
      try {
        const queryFn =
          dl.type === "Paper"
            ? databaseClient.queries.paper
            : databaseClient.queries.sheet;

        const result = await queryFn({ relativePath: dl.relativePath });
        if(result) return result.data.sheet || result.data.paper;
        else return
      } catch (err) {
        console.warn(`Failed to load ${dl.type} ${dl.relativePath}:`, err.message);
        return null;
      }
    })
);

    const filteredContent = content.filter(Boolean); // remove nulls
    return res.status(200).json({
      success: true,
      email,
      count: downloads.length,
      downloads:filteredContent,
    });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
