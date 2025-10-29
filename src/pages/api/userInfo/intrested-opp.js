import clientPromise from "@/lib/mongodb";


export default async function handler(req,res) {
    if(req.method !== 'POST')return res.status(405).json({ error: "Method not allowed" });
    try {
        const {email,filename,type,intrested} = req.body;

        if (!email || !filename) {
        return res
            .status(400)
            .json({ error: "Missing email, pdfUrl, type, or relativePath" });
        }


        const client = await clientPromise;
        const db = client.db("mydb");


        const mongoUser = await db.collection("users").findOne({ email });
        if (!mongoUser) {
        return res.status(401).json({ error: "No user found" });
        }
        

        const existingOpp = await db.collection("users_opportunites").findOne({
            userId: mongoUser._id,
            relativePath:filename,
        });

        

        if (existingOpp) {
        
        await db.collection("users_opportunites").updateOne(
            { _id: existingOpp._id },
            {
            $set: {
                savedAt: new Date(),
                intrested:intrested
            },
            }
        );

        return res
            .status(200)
            .json({ success: true, message: "Opportunites timestamp updated" });
        }


        await db.collection("users_opportunites").insertOne({
            userId: mongoUser._id,
            email,
            type,
            relativePath:filename,
            intrested:intrested,
            savedAt: new Date(),
        });

        return res
        .status(201)
        .json({ success: true, message: "Opportunity successfully saved" });

    }catch(e){
        console.error("Error tracking Opportunity:", e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}