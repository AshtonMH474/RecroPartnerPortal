import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { isFreeEmail } from 'free-email-domains-list';



export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, firstName,lastName,organization,phone } = req.body;
 

  // Block free email domains
  if (isFreeEmail(email)) {
    return res.status(403).json({ error: "Free email providers are not allowed. Please use your company email." });
  }
  
  const client = await clientPromise;
  const db = client.db("mydb");

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
