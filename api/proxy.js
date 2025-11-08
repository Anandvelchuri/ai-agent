const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

if (!NEWS_API_KEY) {
  console.warn('WARNING: NEWS_API_KEY environment variable is not set. The proxy will return 500 until configured.');
}

// CORS middleware with detailed headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.setHeader('Cache-Control', 'no-cache');
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.get('/news', async (req, res) => {
  if (!NEWS_API_KEY) return res.status(500).json({ error: 'NEWS_API_KEY not configured on proxy.' });
  try {
    const url = `https://newsapi.org/v2/top-headlines?country=au&pageSize=5&apiKey=${NEWS_API_KEY}`;
    console.log('Fetching news from NewsAPI...');
    const r = await fetch(url);
    const data = await r.json();
    
    // Log the response for debugging
    console.log('NewsAPI response status:', data.status);
    console.log('NewsAPI total results:', data.totalResults);
    
    // Check if we got a valid response
    if (data.status !== 'ok') {
      console.error('NewsAPI error:', data);
      return res.status(502).json({ error: data.message || 'NewsAPI returned an error' });
    }
    
    // Ensure we have articles
    if (!data.articles || !data.articles.length) {
      console.log('No articles found in NewsAPI response');
      return res.status(404).json({ error: 'No news articles found' });
    }
    
    // Forward NewsAPI response
    console.log(`Returning ${data.articles.length} articles`);
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
