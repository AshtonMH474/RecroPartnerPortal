import { GitHubProvider } from "tinacms-gitprovider-github";
import { MongodbLevel } from "mongodb-level";
import { createLocalDatabase, createDatabase } from "@tinacms/datalayer";
import fs from "fs";
import os from "os";
import path from "path";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

function buildMongoUrl() {
  const tmpDir = os.tmpdir();
  const caPath = path.join(tmpDir, "ca.pem");
  const keyPath = path.join(tmpDir, "mongo.pem");

  // Decode base64 environment variables into temp files
  const ca = Buffer.from(process.env.MONGODB_CA_B64, "base64").toString("utf-8");
  fs.writeFileSync(caPath, ca);

  const key = Buffer.from(process.env.MONGODB_KEY_B64, "base64").toString("utf-8");
  fs.writeFileSync(keyPath, key);

  return `${process.env.MONGODB_URI}&tls=true&tlsCAFile=${caPath}&tlsCertificateKeyFile=${keyPath}`;
}

const tinaMongoUrl = buildMongoUrl();

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        branch: process.env.GITHUB_BRANCH,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
      }),
      databaseAdapter: new MongodbLevel({
        collectionName: `content-${process.env.GITHUB_BRANCH}`,
        dbName: 'tina',
        mongoUri: tinaMongoUrl,
      }),
      // other TinaCMS config here...
    });

