import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
//  use mydb
// db.users.createIndex({ verificationExpires: 1 }, { expireAfterSeconds: 0 })
// add this to conatiner in ec2 so users are deleted if not verified

  const { token } = req.query;
  if (!token) return res.status(400).send("Invalid token");

  const client = await clientPromise;
  const db = client.db("mydb");

  const user = await db.collection("users").findOne({ verificationToken: token });

  if (!user) return res.status(400).send("Invalid or expired token");
  if (user.verificationExpires < new Date()) {
    // expired
    await db.collection("users").deleteOne({ _id: user._id }); // delete unverified user
    return res.status(400).send("Token expired, please sign up again.");
  }

  await db.collection("users").updateOne(
    { verificationToken: token },
    { $set: { verified: true }, $unset: { verificationToken: "", verificationExpires: "" } }
  );

  return res.send("Email verified! You can now log in.");
}