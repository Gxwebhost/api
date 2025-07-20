// /api/use-key.js
const keys = global.keys || (global.keys = new Map());

export default async function handler(req, res) {
  const key = req.query.key;
  if (!key || !keys.has(key)) return res.status(403).json({ error: "Invalid key" });

  const entry = keys.get(key);
  if (entry.used) return res.status(403).json({ error: "Key already used" });
  if (Date.now() > entry.expiresAt) {
    keys.delete(key);
    return res.status(403).json({ error: "Key expired" });
  }

  entry.used = true;
  keys.delete(key);

  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookURL) return res.status(500).json({ error: "Missing webhook env" });

  const body = req.body;

  const forward = await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!forward.ok) return res.status(500).json({ error: "Webhook failed" });

  res.status(200).json({ success: true });
}
