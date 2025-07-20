// /api/generate-key.js

const keys = global.keys || (global.keys = new Map());

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  const key = crypto.randomUUID(); // or custom random generator
  const expiresAt = Date.now() + 30_000; // 30 seconds from now

  keys.set(key, { expiresAt, used: false });

  // Auto-delete after 30 seconds
  setTimeout(() => keys.delete(key), 30_000);

  res.status(200).json({ key });
}
