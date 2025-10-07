import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, password } = req.body;

    const client = await clientPromise;
    const db = client.db("mydb");

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.verified) return res.status(403).json({ error: "Email not verified" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    setCookie("token", token, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 3,
      path: "/",
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
}
