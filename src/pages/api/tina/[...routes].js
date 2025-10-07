import { LocalBackendAuthProvider } from "@tinacms/datalayer";
import { TinaNodeBackend } from "@tinacms/datalayer";
import { CustomBackendAuth } from "@/lib/custom_backend_provider";
import databaseClient from "../../../../tina/__generated__/databaseClient";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// this is used if you can access database and files using backend
const handler = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : CustomBackendAuth(),
    databaseClient
});

export default (req, res) => handler(req, res);