import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { isFreeEmail } from 'free-email-domains-list';
import { withCsrfProtection } from "@/lib/csrfMiddleware";
import { withRateLimit } from "@/lib/rateLimit";
import { sanitizeSignupData } from "@/lib/sanitize";

 async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Validate and sanitize input
  const result = sanitizeSignupData(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  const { email, password, firstName, lastName, organization, phone } = result.data;

  // Block free email domains
  if (isFreeEmail(email)) {
    return res.status(403).json({ error: "Free email providers are not allowed. Please use your company email." });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);

  const existing = await db.collection("users").findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" ,verified:existing.verified});

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  await db.collection("users").insertOne({
    email,
    passwordHash,
    firstName,
    lastName,
    organization,
    phone,
    verified: false,
    verificationToken,
    verificationExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes in ms
    createdAt: new Date(),
  });

  // Send verification email

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/#verify?token=${verificationToken}`;
 
  await transporter.sendMail({
    from: `Recro: Verify Email <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<p>Hi ${firstName} ${lastName},</p>
           <p>Click <a href="${verificationUrl}">here</a> to verify your email. This link expires in 10 minutes.</p>`,
  });

  res.status(201).json({ ok: true });
}

export default withRateLimit(withCsrfProtection(handler), {
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many form submissions. Please wait a minute before trying again.'
});