import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Invalid token");

  const client = await clientPromise;
  const db = client.db("mydb");

  const user = await db.collection("users").findOne({ verificationToken: token });
  if (!user) return res.status(400).send("Invalid or expired token");

  if (user.verificationExpires < new Date()) {
    // expired
    await db.collection("users").deleteOne({ _id: user._id });
    return res.status(400).send("Token expired, please sign up again.");
  }

  // mark as verified
  await db.collection("users").updateOne(
    { verificationToken: token },
    { $set: { verified: true }, $unset: { verificationToken: "", verificationExpires: "" } }
  );

  // -----------------------------
  // HUBSPOT CONTACT CHECK/CREATE
  // -----------------------------
  const hubspotApiKey = process.env.HUBSPOT_TOKEN;
  const email = user.email;

  // 1. Search for existing contact by email
  const searchResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${hubspotApiKey}`
    },
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: "email", operator: "EQ", value: email }] }
      ],
      properties: ["email", "firstname", "lastname", "company"]
    })
  });

  const searchData = await searchResponse.json();
  let contactId;

  if (searchData.total > 0) {
    // contact exists
    contactId = searchData.results[0].id;
  } else {
    // contact does not exist, create new one
    const createResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${hubspotApiKey}`
      },
      body: JSON.stringify({
        properties: {
          email: user.email,
          firstname: user.firstName || "",
          lastname: user.lastName || "",
          company: user.organzation || "",
          phone: user.phone || ""
        }
      })
    });

    const createData = await createResponse.json();
    contactId = createData.id;
  }

  // Optionally store the HubSpot contact ID in your DB
  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { hubspotContactId: contactId } }
  );

  return res.send("Email verified! HubSpot contact synced. You can now log in.");
}
