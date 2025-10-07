import { deleteCookie } from "cookies-next";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Delete the token cookie
  deleteCookie("token", { req, res, path: "/" });

  res.status(200).json({ ok: true });
}