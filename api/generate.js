import { v4 as uuidv4 } from 'uuid';

// In-memory storage for keys (for production, use a proper database)
const activeKeys = new Map();

setInterval(() => {
  // Clean up expired keys every minute
  const now = Date.now();
  for (const [key, data] of activeKeys.entries()) {
    if (data.expiresAt < now) {
      activeKeys.delete(key);
    }
  }
}, 60000);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Generate a secure random key
  const key = uuidv4() + '-' + crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 30000; // 30 seconds from now

  // Store the key
  activeKeys.set(key, {
    expiresAt,
    createdAt: Date.now(),
    used: false
  });

  res.status(200).json({ key });
}
