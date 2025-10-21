import { tinaClient } from "@/lib/tinaClient";

export default async function handler(req,res) {
    try{
        const cats = await tinaClient.queries.categoryConnection()
        const allCats = cats.data.categoryConnection.edges.map(e => e.node);

        return res.status(200).json({sucess:true,categories:allCats})

    }catch(e){
        console.error("Error getting Categpries:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}