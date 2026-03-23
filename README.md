# DISTILL — Bộ Não Thứ Hai

Single-file web app + Vercel serverless backend.

## Deploy to Vercel

1. Push this folder to GitHub
2. Import project on vercel.com
3. Set environment variable: `GROK_API_KEY=xai-...`
4. Deploy → done

## Local dev

```bash
npm i -g vercel
vercel dev
```
App runs at http://localhost:3000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GROK_API_KEY` | Your Grok API key from console.x.ai |

## File structure

```
/api/grok.js          ← Serverless function (Grok proxy)
/public/index.html    ← Full app (HTML + CSS + JS)
/vercel.json          ← Vercel routing config
```

## Firestore Collections

| Collection | Description |
|------------|-------------|
| `ideas` | All idea entries |
| `config/categories` | Shared category list |
| `config/global_settings` | Global settings (prompt override, etc.) |
