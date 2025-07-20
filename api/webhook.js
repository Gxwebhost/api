import { activeKeys } from './generate';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const key = authHeader.split(' ')[1];
  if (!activeKeys.has(key)) {
    return res.status(403).json({ error: 'Invalid or expired key' });
  }

  const keyData = activeKeys.get(key);
  
  // Mark as used and delete
  activeKeys.delete(key);

  // Process your webhook payload here
  console.log('Received valid webhook:', req.body);

  res.status(200).json({ success: true });
}
