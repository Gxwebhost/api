import { activeKeys } from './generate';

export default async function handler(req, res) {
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

  // Mark as used and delete
  activeKeys.delete(key);

  try {
    // Forward to the real webhook
    const webhookResponse = await fetch(process.env.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add your secret if needed
        'X-Secret': process.env.SECRET_KEY || ''
      },
      body: JSON.stringify(req.body)
    });

    const data = await webhookResponse.json();
    res.status(webhookResponse.status).json(data);
  } catch (error) {
    console.error('Webhook forwarding failed:', error);
    res.status(500).json({ error: 'Failed to forward webhook' });
  }
}
