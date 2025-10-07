import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  const client = await clientPromise;
  const db = client.db("mydb");

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    // Don't reveal if user exists
    return res.status(200).json({ ok: true });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        resetToken,
        resetExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
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

  const resetUrl = `${process.env.NEXTAUTH_URL}/#resetpassword?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Recro" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>You requested to reset your password.</p>
           <p>Click <a href="${resetUrl}">here</a> to set a new password. 
           This link expires in 15 minutes.</p>`,
  });

  res.status(200).json({ ok: true });
}
