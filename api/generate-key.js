// /api/generate-key.js
const keys = global.keys || (global.keys = new Map());

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  const key = crypto.randomUUID();
  const expiresAt = Date.now() + 30_000;

  keys.set(key, { expiresAt, used: false });

  setTimeout(() => keys.delete(key), 30_000);

  res.status(200).json({ key });
}
