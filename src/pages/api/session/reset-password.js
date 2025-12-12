import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { withCsrfProtection } from "@/lib/csrfMiddleware";

 async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, newPassword } = req.body;

  // ✅ NoSQL Injection Protection: Validate input types
  if (typeof token !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ error: "Invalid input format" });
  }

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  // ✅ Password Complexity Requirements
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  if (newPassword.length > 128) {
    return res.status(400).json({ error: "Password must be less than 128 characters" });
  }

  // Require at least: 1 uppercase, 1 lowercase, 1 number, 1 special character
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[@$!%*?&]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return res.status(400).json({
      error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    });
  }

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

export default withCsrfProtection(handler);