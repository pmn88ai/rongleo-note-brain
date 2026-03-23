// ============================================================
// /api/groq.js — Vercel Serverless Function
// Proxies requests to Groq API using server-side API key.
// Set GROQ_API_KEY in Vercel → Settings → Environment Variables
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured on server' });

  try {
    const { model, messages, max_tokens } = req.body;
    if (!messages?.length) return res.status(400).json({ error: 'messages array required' });

    const body = { model: model || 'llama-3.3-70b-versatile', messages };
    if (max_tokens) body.max_tokens = max_tokens;

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    console.error('[/api/groq] error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
