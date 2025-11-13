import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Invalid token");

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);

  const user = await db.collection("users").findOne({ verificationToken: token });
  if (!user) return res.status(400).send("Invalid or expired token");

  if (user.verificationExpires < new Date()) {
    // expired
    await db.collection("users").deleteOne({ _id: user._id });
    return res.status(400).send("Token expired, please sign up again.");
  }

  // -----------------------------
  // HUBSPOT CONTACT CHECK/CREATE
  // -----------------------------
  const hubspotApiKey = process.env.HUBSPOT_TOKEN;
  const email = user.email;

  // Check if HubSpot API key is configured (required before verification)
  if (!hubspotApiKey) {
    console.error("HUBSPOT_TOKEN not configured - verification blocked");
    return res.status(500).send("System configuration error. Please contact support.");
  }

  try {
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

    // Check response status
    if (!searchResponse.ok) {
      throw new Error(`HubSpot search failed: ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    let contactId;

    if (searchData.total > 0) {
      // contact exists
      contactId = searchData.results[0].id;
      console.log(`HubSpot contact found: ${contactId}`);
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
            company: user.organization || "",
            phone: user.phone || ""
          }
        })
      });

      // Check response status
      if (!createResponse.ok) {
        const errorBody = await createResponse.text();
        throw new Error(`HubSpot create failed: ${createResponse.status} ${errorBody}`);
      }

      const createData = await createResponse.json();
      contactId = createData.id;
      console.log(`HubSpot contact created: ${contactId}`);
    }

    // Mark user as verified and store HubSpot contact ID
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { verified: true, hubspotContactId: contactId },
        $unset: { verificationToken: "", verificationExpires: "" }
      }
    );

    return res.send("Email verified! HubSpot contact synced. You can now log in.");

  } catch (hubspotError) {
    // Log error - HubSpot sync failed, so verification fails
    console.error("HubSpot sync failed:", hubspotError.message);
    console.error("Stack:", hubspotError.stack);

    // Verification fails if HubSpot sync fails
    return res.status(500).send("Email verification failed due to HubSpot sync error. Please try again or contact support.");
  }
}