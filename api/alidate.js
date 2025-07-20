// Import the same activeKeys Map from generate.js
import { activeKeys } from './generate';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: 'Key is required' });
  }

  if (!activeKeys.has(key)) {
    return res.status(404).json({ error: 'Key not found or expired' });
  }

  const keyData = activeKeys.get(key);

  if (keyData.used) {
    activeKeys.delete(key);
    return res.status(410).json({ error: 'Key already used' });
  }

  // Mark as used and delete
  activeKeys.delete(key);

  // Here you would typically forward the request to your actual webhook
  // For this example, we'll just return success
  res.status(200).json({ success: true });
}
