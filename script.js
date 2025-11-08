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
    const url = `${PROXY_URL}/news`;
    console.log('Fetching news from:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('Response:', data);

    if (!data.articles || data.articles.length === 0) {
      newsDiv.innerHTML = 'No news found.';
      return;
    }

    newsDiv.innerHTML = '<h2>Top 5 News in Australia</h2>' +
      data.articles.map(article => `
        <div class="news-item">
          <a href="${article.url}" target="_blank">${article.title}</a>
          ${article.description ? `<p>${article.description}</p>` : ''}
        </div>
      `).join('');
  } catch (err) {
    console.error('Error fetching news:', err);
    newsDiv.innerHTML = `<span style="color:red;">Error loading news: ${err.message}</span>`;
  }
}