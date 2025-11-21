# City weather and news App

A small frontend + proxy demo that shows local weather and top news in Australia. The frontend is served via GitHub Pages (or locally) and it calls a small Express proxy to fetch NewsAPI results so the NewsAPI key is kept on the server side.

Features
- Search weather for an Australian city (OpenWeatherMap)
- Show top news (NewsAPI) via a secure proxy (no API key in the browser)

Repository layout (important files)
- `index.html` — Main single-page UI (served on GitHub Pages or locally)
- `script.js` — Frontend logic for weather and news requests
- `style.css` — Styles for the page
- `api/proxy.js` — Express proxy that forwards requests to NewsAPI and hides the API key
- `package.json` — Node project config (proxy dependencies and scripts)

Quick start (development)

1. Clone the repo

   git clone https://github.com/Anandvelchuri/ai-agent.git
   cd ai-agent

2. Frontend: open `index.html` in your browser for a quick check.

3. Run the proxy locally (optional, for secure NewsAPI access)

   # from repository root
   cd api
   npm install

   # set your NEWS_API_KEY in the environment and start the server
   # PowerShell (Windows):
   $env:NEWS_API_KEY = '<your-newsapi-key>'; node proxy.js

   # WSL / Linux / macOS:
   NEWS_API_KEY="<your-newsapi-key>" node proxy.js

   By default the proxy listens on port 10000 (override with PORT env).

4. Open the frontend (e.g., `index.html`) and the page will call the proxy at the configured `PROXY_URL` in `script.js`. If you're running the proxy locally, update `PROXY_URL` to `http://localhost:10000` in `script.js` (or set it to blank to use the NewsAPI directly, though that's not recommended because it exposes the key).

Environment / configuration
- `NEWS_API_KEY` (required for the proxy) — set this on the server (Render, Heroku, etc.) or locally before starting `proxy.js`.
- `PORT` (optional) — port the proxy listens on (defaults to 10000).

Production / Deployment notes
- Frontend: GitHub Pages — push `index.html`, `script.js`, and `style.css` to the repo main branch (or `gh-pages` branch). The current project was deployed to GitHub Pages.
- Proxy: Deploy `api/proxy.js` to a Node hosting provider (Render, Heroku, etc.). Make sure to set `NEWS_API_KEY` in the environment settings of your host. Example from the work: https://ai-agent-tb0i.onrender.com

Security notes
- Do NOT put your NewsAPI or other API keys into `script.js` or any frontend file. Always use a server-side proxy or backend to keep keys secret.

Troubleshooting
- News not loading (frontend stuck on "Loading news...")
  - Open browser DevTools (F12) -> Console and Network tabs to inspect the request to `/news`.
  - If the request fails with CORS errors, ensure the proxy sets proper CORS headers (proxy includes Access-Control-Allow-Origin: *).
  - If the proxy returns 500, check the `/health` endpoint on the proxy (`/health`) to see if `newsApiKeySet` is true and check the host logs for errors.

- Proxy returns empty articles
  - Confirm your `NEWS_API_KEY` is correct and has access. Use the proxy health endpoint and check host logs for the NewsAPI response details.
  - The proxy is configured to use the `everything` endpoint with a `q=australia` filter. If you want `top-headlines`, update `api/proxy.js` accordingly.

Development tips
- When debugging, run the proxy locally and point `PROXY_URL` to `http://localhost:10000` in `script.js` and open `index.html` from the filesystem or a simple static server.
- To serve the frontend locally via a simple Python server (useful to avoid file:// issues):

  # Python 3
  python -m http.server 8080

  Then browse to http://localhost:8080

Useful endpoints (when proxy is deployed)
- `GET /` — basic proxy health/status
- `GET /health` — JSON with `newsApiKeySet` boolean and node env
- `GET /news` — proxied NewsAPI response (JSON)

How to contribute
- Open an issue or PR with improvements: examples include adding region selection for news, caching, or support for other weather providers.


Developed By   
Anand Velchuri

