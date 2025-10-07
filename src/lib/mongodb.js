import { MongoClient } from "mongodb";
import fs from "fs";
import os from "os";
import path from "path";

const uri = process.env.MONGODB_URI;

function buildOptions() {
  const tmpDir = os.tmpdir(); // cross-platform temp directory
  const caPath = path.join(tmpDir, "ca.pem");
  const keyPath = path.join(tmpDir, "mongo.pem");


  // Write decoded files to temp
  const ca = Buffer.from(process.env.MONGODB_CA_B64, "base64").toString("utf-8");
  fs.writeFileSync(caPath, ca);

  const key = Buffer.from(process.env.MONGODB_KEY_B64, "base64").toString("utf-8");
  fs.writeFileSync(keyPath, key);

  return {
    tls: true,
    tlsCAFile: caPath,
    tlsCertificateKeyFile: keyPath,
  };
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


