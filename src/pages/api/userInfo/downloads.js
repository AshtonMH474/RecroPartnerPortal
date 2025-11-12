
import clientPromise from "@/lib/mongodb";
import { tinaClient } from "@/lib/tinaClient";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const dbclient = await clientPromise;
    const db = dbclient.db("mydb");

    // ✅ Fetch user first
    const mongoUser = await db
      .collection("users")
      .findOne({ email }, { projection: { _id: 1 } });

    if (!mongoUser) return res.status(404).json({ error: "User not found" });

    // ✅ Query downloads directly with userId filter (MUCH faster!)
    const userDownloads = await db
      .collection("downloads")
      .find(
        {
          userId: mongoUser._id,
          type: { $in: ["Paper", "Sheet", "Statements"] },
          relativePath: { $exists: true, $ne: null },
        },
        {
          sort: { downloadedAt: -1 },

          projection: { relativePath: 1, type: 1 }, // ✅ Only fetch needed fields
        }
      )
      .toArray();

    // Fast exit if none
    if (!userDownloads.length) {
      return res.status(200).json({
        success: true,
        email,
        count: 0,
        downloads: [],
      });
    }

    // ✅ Pre-compute type mapping
    const queryMap = {
      Paper: tinaClient.queries.paper,
      Sheet: tinaClient.queries.sheet,
      Statements: tinaClient.queries.statements,
    };

    // ✅ Fetch ALL Tina content in PARALLEL (not sequential!)
    const results = await Promise.allSettled(
      userDownloads.map(async (dl) => {
        const queryFn = queryMap[dl.type];
        if (!queryFn) return null;

        try {
          const result = await queryFn({ relativePath: dl.relativePath });
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

    const filtered = results
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => r.value);

    // ✅ Set cache headers
    res.setHeader("Cache-Control", "private, s-maxage=60, stale-while-revalidate=120");

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
