import { deleteCookie } from "cookies-next";
import { withCsrfProtection } from "@/lib/csrfMiddleware";


 async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Delete the token cookie
  deleteCookie("token", { req, res, path: "/" });
  deleteCookie("refresh_token", { req, res, path: "/" });

  res.status(200).json({ ok: true });
}

export default withCsrfProtection(handler);