import clientPromise from "@/lib/mongodb";
import { tinaClient } from "@/lib/tinaClient";
import fs from "fs";
import path from "path";

export default async function handler(req,res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try{
        const {email} = req.query;
        if(!email){
            return res.status(400).json({ error: "Missing email" });
        }

        const dbclient = await clientPromise;
        const db = dbclient.db("mydb");

        const mongoUser = await db.collection("users").findOne({ email });
        if (!mongoUser) {
        return res.status(404).json({ error: "User not found" });
        }

        const opps = await db
        .collection("users_opportunites")
        .find({ userId: mongoUser._id })
        .sort({ savedAt: -1 })
        .toArray();
        
        

        const contentDir = path.join(process.cwd(), "content");

        const content = await Promise.all(
          opps
            .map(async (dl) => {
              let type = '\opportunites'
              const filePath = path.join(contentDir,type, dl.relativePath.replace(/\\/g, "/"));
              if (!fs.existsSync(filePath)) {
                return null;
              }
        
              try {
                
                const queryFn = tinaClient.queries.opportunites;
        
                const result = await queryFn({ relativePath: dl.relativePath });
                let oppData = result?.data?.opportunites  || null;
                return {
                    ...oppData,
                     submitted: dl.intrested,
                     saved:true,
                    savedAt: dl.savedAt,
                    _id: dl._id,
                }
              } catch (err) {
                console.error(`Error loading  ${dl.relativePath}:`, err);
                return null;
              }
            })
        );

        const filteredContent = content.filter(Boolean); // remove nulls
        return res.status(200).json({
        success: true,
        email,
        count: opps.length,
        opps:filteredContent
        });
    }catch(e){
        console.error("Error fetching opportunites:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}