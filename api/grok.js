// ============================================================
// /api/grok.js — Vercel Serverless Function
// Proxies requests to Grok API using server-side API key.
// API key lives in GROK_API_KEY environment variable on Vercel.
// ============================================================

export default async function handler(req, res) {
  // CORS — allow from any origin (restrict in production if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROK_API_KEY not configured on server' });
  }

  try {
    const { model = 'grok-2-latest', messages, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const body = { model, messages };
    if (max_tokens) body.max_tokens = max_tokens;

    const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error("GROK FULL ERROR:", data);
      return res.status(upstream.status).json({
        error: JSON.stringify(data)
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('[/api/grok] error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
