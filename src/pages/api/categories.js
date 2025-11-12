import { tinaClient } from "@/lib/tinaClient";

// ✅ In-memory cache for categories (they rarely change)
let cachedCategories = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  // ✅ Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Check cache first (categories are relatively static)
    const now = Date.now();
    if (cachedCategories && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      return res.status(200).json({ success: true, categories: cachedCategories });
    }

    // ✅ Fetch from TinaCMS
    const cats = await tinaClient.queries.categoryConnection();
    
    // ✅ Optimize mapping (direct extraction)
    const allCats = cats.data?.categoryConnection?.edges?.map(e => e.node) || [];

    // ✅ Update cache
    cachedCategories = allCats;
    cacheTimestamp = now;

    // ✅ Set aggressive cache headers (categories change infrequently)
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({ success: true, categories: allCats });

  } catch (error) {
    // ✅ Fixed: Use 'error' instead of undefined variable
    console.error("Error getting Categories:", error);
    
    // ✅ Return cached data if available (graceful degradation)
    if (cachedCategories) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return res.status(200).json({ success: true, categories: cachedCategories });
    }
    
    return res.status(500).json({ error: "Internal Server Error" });
  }
}