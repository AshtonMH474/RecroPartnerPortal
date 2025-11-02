import clientPromise from "@/lib/mongodb";
import { tinaClient } from "@/lib/tinaClient";
import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const dbclient = await clientPromise;
    const db = dbclient.db("mydb");

    // Fetch user and downloads in parallel
    const [mongoUser, downloads] = await Promise.all([
      db.collection("users").findOne({ email }),
      db
        .collection("downloads")
        .find({})
        .sort({ downloadedAt: -1 })
        .toArray(),
    ]);

    if (!mongoUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter user’s downloads
    const userDownloads = downloads.filter(
      (d) => d.userId?.toString() === mongoUser._id.toString()
    );

    const contentDir = path.join(process.cwd(), "content");

    const results = await Promise.allSettled(
      userDownloads
        .filter((dl) => dl?.relativePath && ["Paper", "Sheet"].includes(dl?.type))
        .map(async (dl) => {
          const subdir = dl.type === "Paper" ? "papers" : "sheets";
          const filePath = path.join(contentDir, subdir, dl.relativePath.replace(/\\/g, "/"));

          try {
            await fs.access(filePath); // check file exists (async)
          } catch {
            return null; // skip missing files
          }

          const queryFn =
            dl.type === "Paper"
              ? tinaClient.queries.paper
              : tinaClient.queries.sheet;

          const result = await queryFn({ relativePath: dl.relativePath });
          return result?.data?.paper || result?.data?.sheet || null;
        })
    );

    const filteredContent = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

    return res.status(200).json({
      success: true,
      email,
      count: filteredContent.length,
      downloads: filteredContent.slice(0, 8), // Only return top 8 if desired
    });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
