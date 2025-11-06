
import clientPromise from "@/lib/mongodb";
import { tinaClient } from "@/lib/tinaClient";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const dbclient = await clientPromise;
    const db = dbclient.db("mydb");

    // Fetch user + downloads in parallel
    const [mongoUser, downloads] = await Promise.all([
      db.collection("users").findOne({ email }, { projection: { _id: 1 } }),
      db
        .collection("downloads")
        .find({}, { sort: { downloadedAt: -1 } })
        .limit(50) // <-- limit if you can, to avoid processing everything
        .toArray(),
    ]);

    if (!mongoUser) return res.status(404).json({ error: "User not found" });

    // Filter downloads by user
    const userDownloads = downloads.filter(
      (d) => d.userId?.toString() === mongoUser._id.toString()
    );

    // Fast exit if none
    if (!userDownloads.length)
      return res.status(200).json({ success: true, downloads: [] });

    const contentDir = path.join(process.cwd(), "content");

    // Small helper: map type to Tina query + subdir
    const typeMap = {
      Paper: { subdir: "papers", query: tinaClient.queries.paper },
      Sheet: { subdir: "sheets", query: tinaClient.queries.sheet },
      Statements: { subdir: "statements", query: tinaClient.queries.statements },
    };

    // Use concurrency control (e.g., 10 at a time)
    const limit = 10;
    const chunks = [];
    for (let i = 0; i < userDownloads.length; i += limit)
      chunks.push(userDownloads.slice(i, i + limit));

    const results = [];
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk
          .filter((dl) => dl?.relativePath && typeMap[dl.type])
          .map(async (dl) => {
            const { subdir, query } = typeMap[dl.type];
            const filePath = path.join(
              contentDir,
              subdir,
              dl.relativePath.replace(/\\/g, "/")
            );

            try {
              const result = await query({ relativePath: dl.relativePath });
              return (
                result?.data?.paper ||
                result?.data?.sheet ||
                result?.data?.statements ||
                null
              );
            } catch {
              return null;
            }
          })
      );
      results.push(...chunkResults);
    }

    const filtered = results.filter(Boolean);

    return res.status(200).json({
      success: true,
      email,
      count: filtered.length,
      downloads: filtered,
    });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
