import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { withCsrfProtection } from "@/lib/csrfMiddleware";
import { withRateLimit } from "@/lib/rateLimit";
import { sanitizePasswordResetData } from "@/lib/sanitize";

 async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Validate and sanitize input
  const result = sanitizePasswordResetData({
    resetToken: req.body.token,
    newPassword: req.body.newPassword
  });
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  const { resetToken: token, newPassword } = result.data;

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

export default withRateLimit(withCsrfProtection(handler), {
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many form submissions. Please wait a minute before trying again.'
});