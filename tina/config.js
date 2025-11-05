import { defineConfig } from "tinacms";
import { LocalAuthProvider } from "tinacms";
import { CustomAuthProvider } from "@/lib/custom_auth_provider";
import pages from "./collections/pages/page";
import nav from "./collections/nav/nav";
import footer from "./collections/footer/footer";
import { categories } from "./collections/categories/categories";
import { papers } from "./collections/papers/papers";
import { sheets } from "./collections/sheets/sheets";
import { opportunites } from "./collections/opportunites/opportunites";
import { statements } from "./collections/capStatements/statements";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  branch,
  // Get this from tina.io
  contentApiUrlOverride:'/api/tina/gql',
  // if in local no authprovider is used and just logs
  // in but if in production it uses my custom google auth 2.0
  authProvider:isLocal
    ? new LocalAuthProvider()
    : new CustomAuthProvider(),


  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    loadCustomStore:async () => {
        const pack = await import("next-tinacms-s3");
        return pack.TinaCloudS3MediaStore;
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      pages,
      nav,
      footer,
      categories,
      papers,
      sheets,
      opportunites,
      statements
    ],
  },
});
