import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, pdfUrl } = req.body;

    if (!email || !pdfUrl) {
      return res.status(400).json({ error: "Missing email or pdfUrl" });
    }

    // 👉 Example: log it (replace with DB save if needed)
    console.log(`Download tracked: ${email} downloaded ${pdfUrl}`);
    const client = await clientPromise
    const db = client.db("mydb")
    const mongoUser = await db.collection("users").findOne({ email });
    if(!mongoUser) return res.status(401).json({error:'No User Here'})
    
    
     await db.collection("downloads").insertOne({
      userId: mongoUser._id, 
      email,
      pdfUrl,
      downloadedAt: new Date(),
    });

    return res.status(200).json({ success: true, message: "Download tracked" });
  } catch (error) {
    console.error("Error tracking download:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}