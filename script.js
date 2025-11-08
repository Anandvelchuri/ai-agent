// Render.com proxy URL
const PROXY_URL = 'https://ai-agent-tb0i.onrender.com';
const WEATHER_API_KEY = '240d7be466a311f98ab451c98ac38334';

async function getInfo() {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }
  getWeather(city);
  getNews();
}

async function getWeather(city) {
  const weatherDiv = document.getElementById('weather');
  weatherDiv.innerHTML = 'Loading weather...';
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},AU&appid=${WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <p><b>${data.weather[0].main}</b>: ${data.weather[0].description}</p>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (err) {
    weatherDiv.innerHTML = `<span style="color:red;">Weather not found for "${city}".</span>`;
  }
}

async function getNews() {
  const newsDiv = document.getElementById('news');
  newsDiv.innerHTML = 'Loading news...';
  try {
    const url = `${PROXY_URL.replace(/\/$/, '')}/news`;
    console.log('Fetching news from proxy...');
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    let errorText;
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          errorText = JSON.stringify(data);
          throw new Error(`API Error: ${data.error || data.message || 'Unknown error'}`);
        }
        if (!data.articles || data.articles.length === 0) {
          newsDiv.innerHTML = 'No news found.';
          return;
        }
        newsDiv.innerHTML = '<h2>Top 5 News in Australia</h2>' +
          data.articles.map(article => `
            <div class="news-item">
              <a href="${article.url}" target="_blank"><b>${article.title}</b></a>
              <p>${article.description || ''}</p>
            </div>
          `).join('');
        return;
      } else {
        errorText = await res.text();
        throw new Error('Response was not JSON');
      }
    } catch (parseError) {
      console.error('Response parsing failed:', parseError);
      throw new Error(`Failed to parse response: ${errorText || parseError.message}`);
    }
    newsDiv.innerHTML = '<span style="color:red;">Failed to load news data.</span>';
  } catch (err) {
    console.error('getNews error:', err);
    newsDiv.innerHTML = `<span style="color:red;">Could not load news. Check console for details.</span>`;
  }
}