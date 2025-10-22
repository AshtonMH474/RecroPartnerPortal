import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";
import { isFreeEmail } from "free-email-domains-list";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email, organization, subject, message, phone } = req.body;

  if (!email || !subject || !message || !organization) {
    return res.status(400).json({ error: "Missing required fields" });
  }


  // if(isFreeEmail(email)){
  //   return res.status(403).json({ error: "Free email providers are not allowed. Please use your company email." });
  // }
  
  try {
    // 1️⃣ Setup email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: organization ? process.env.SMTP_USER : process.env.SMTP_CAREER_HOST,
        pass: organization ? process.env.SMTP_PASS : process.env.SMTP_CAREER_PASS,
      },
    });

    // 2️⃣ Prepare email
    const mailOptions = {
      from: `"Website Contact" <${organization ? process.env.SMTP_USER : process.env.SMTP_CAREER_HOST}>`,
      to: organization ? process.env.CONTACT_EMAIL : process.env.CONTACT_CAREER_EMAIL,
      replyTo: email,
      subject: `Form Submission: ${subject}`,
      text: organization
        ? `You received a new message from ${firstName} ${lastName} (${email})\n\nOrganization: ${organization}\n\nMessage:\n${message}`
        : `You received a new message from ${firstName} ${lastName} (${email})\n\nPhone Number: ${phone}\n\nMessage:\n${message}`,
    };

    // 3️⃣ Send email
    await transporter.sendMail(mailOptions);

    // 4️⃣ Save to MongoDB (via clientPromise)
    const client = await clientPromise;
    const db = client.db("mydb"); // 👈 replace with your actual DB name
    const collectionName = organization ? "messages" : "careers";

    const doc = {
      firstName,
      lastName,
      email,
      subject,
      message,
      organization: organization || null,
      phone: phone || null,
      createdAt: new Date(),
    };

    await db.collection(collectionName).insertOne(doc);

    // 5️⃣ Respond success
    return res.status(200).json({ success: true, message: "Message sent and saved" });
  } catch (error) {
    console.error("Error handling form submission:", error);
    return res.status(500).json({ error: "Failed to send or save message" });
  }
}
