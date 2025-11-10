import { MongoClient } from "mongodb";
import fs from "fs";
import os from "os";
import path from "path";

const uri = process.env.MONGODB_URI;

// Cache options to avoid repeated file writes
let cachedOptions = null;

function buildOptions() {
  // Return cached options if already built
  if (cachedOptions) {
    return cachedOptions;
  }

  const tmpDir = os.tmpdir(); // cross-platform temp directory
  const caPath = path.join(tmpDir, "ca.pem");
  const keyPath = path.join(tmpDir, "mongo.pem");

  // Only write files if they don't exist or content has changed
  const ca = Buffer.from(process.env.MONGODB_CA_B64, "base64").toString("utf-8");
  const key = Buffer.from(process.env.MONGODB_KEY_B64, "base64").toString("utf-8");

  // Check if files exist and have correct content before writing
  let needsWrite = false;
  try {
    const existingCa = fs.readFileSync(caPath, "utf-8");
    const existingKey = fs.readFileSync(keyPath, "utf-8");
    if (existingCa !== ca || existingKey !== key) {
      needsWrite = true;
    }
  } catch (error) {
    // Files don't exist, need to write them
    needsWrite = true;
  }

  if (needsWrite) {
    fs.writeFileSync(caPath, ca);
    fs.writeFileSync(keyPath, key);
  }

  cachedOptions = {
    tls: true,
    tlsCAFile: caPath,
    tlsCertificateKeyFile: keyPath,
  };

  return cachedOptions;
}

const options = buildOptions();

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;


