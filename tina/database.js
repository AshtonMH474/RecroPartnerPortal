import { GitHubProvider } from 'tinacms-gitprovider-github';
import { MongodbLevel } from 'mongodb-level';
import { createLocalDatabase, createDatabase } from '@tinacms/datalayer';
import fs from 'fs';
import os from 'os';
import path from 'path';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

// Cache URL to avoid repeated file writes
let cachedMongoUrl = null;

function buildMongoUrl() {
  // Return cached URL if already built
  if (cachedMongoUrl) {
    return cachedMongoUrl;
  }

  const tmpDir = os.tmpdir();
  const caPath = path.join(tmpDir, 'ca.pem');
  const keyPath = path.join(tmpDir, 'mongo.pem');

  // Only write files if they don't exist or content has changed
  const ca = Buffer.from(process.env.MONGODB_CA_B64, 'base64').toString('utf-8');
  const key = Buffer.from(process.env.MONGODB_KEY_B64, 'base64').toString('utf-8');

  // Check if files exist and have correct content before writing
  let needsWrite = false;
  try {
    const existingCa = fs.readFileSync(caPath, 'utf-8');
    const existingKey = fs.readFileSync(keyPath, 'utf-8');
    if (existingCa !== ca || existingKey !== key) {
      needsWrite = true;
    }
  } catch {
    // Files don't exist, need to write them
    needsWrite = true;
  }

  if (needsWrite) {
    fs.writeFileSync(caPath, ca);
    fs.writeFileSync(keyPath, key);
  }

  cachedMongoUrl = `${process.env.MONGODB_URI}&tls=true&tlsCAFile=${caPath}&tlsCertificateKeyFile=${keyPath}`;
  return cachedMongoUrl;
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
        dbName: 'partner-tina',
        mongoUri: tinaMongoUrl,
      }),
      // other TinaCMS config here...
    });
