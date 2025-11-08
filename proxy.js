const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  console.warn('WARNING: NEWS_API_KEY environment variable is not set. The proxy will return 500 until configured.');
}

// Simple CORS - allow all origins (fine for a small personal proxy)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/news', async (req, res) => {
  if (!NEWS_API_KEY) return res.status(500).json({ error: 'NEWS_API_KEY not configured on proxy.' });
  try {
    const url = `https://newsapi.org/v2/top-headlines?country=au&pageSize=5&apiKey=${NEWS_API_KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    // Forward NewsAPI response directly
    res.json(data);
  } catch (err) {
    console.error('Error fetching news:', err && err.message ? err.message : err);
    res.status(502).json({ error: 'Failed to fetch news from source.' });
  }
});

// Simple health endpoint to help debug deployments
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    newsApiKeySet: !!NEWS_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'undefined'
  });
});

app.listen(PORT, () => {
  console.log(`News proxy listening on http://localhost:${PORT} (use /news).`);
});
