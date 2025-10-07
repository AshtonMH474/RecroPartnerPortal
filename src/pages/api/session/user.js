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
    res.status(200).json({ user });
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    res.status(401).json({ user: null });
  }
}