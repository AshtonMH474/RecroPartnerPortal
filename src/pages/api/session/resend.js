import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const client = await clientPromise;
  const db = client.db("mydb");

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.verified) return res.status(400).json({ error: "User already verified" });

  // prevent spamming: check lastSent
  const now = new Date();
  if (user.lastVerificationSent && now - user.lastVerificationSent < 60 * 1000) {
    return res.status(429).json({ error: "Please wait 1 minute before requesting again" });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        verificationToken,
        verificationExpires,
        lastVerificationSent: now,
      },
    }
  );

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

   const verificationUrl = `${process.env.NEXTAUTH_URL}/#verify?token=${verificationToken}`
  await transporter.sendMail({
    from: `"Recro" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Verify your email (Resent)",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email. This link expires in 10 minutes.</p>`,
  });

  return res.json({ ok: true });
}
