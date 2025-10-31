import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    const rawCookie = req.headers.cookie || "";
    const token = rawCookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return res.status(401).json({ user: null });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise
    const db = client.db('mydb')
    const dbUser = await db.collection('users').findOne({email:user.email})
    if (!dbUser) return res.status(401).json({ error: "Unauthrozied" });
    const newUser = {...user,hubspotID:dbUser.hubspotContactId,firstName:dbUser.firstName,lastName:dbUser.lastName,organization:dbUser.organization,interests:dbUser?.interests}
    res.status(200).json({ user:newUser });
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    res.status(401).json({ user: null });
  }
}