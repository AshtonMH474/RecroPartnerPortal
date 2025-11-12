import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, newPassword } = req.body;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);

  const user = await db.collection("users").findOne({ resetToken: token });
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  if (user.resetExpires < new Date()) {
    await db.collection("users").updateOne(
      { _id: user._id },
      { $unset: { resetToken: "", resetExpires: "" } }
    );
    return res.status(400).json({ error: "Token expired, request a new reset." });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: { passwordHash },
      $unset: { resetToken: "", resetExpires: "" },
    }
  );

  res.status(200).json({ ok: true });
}
