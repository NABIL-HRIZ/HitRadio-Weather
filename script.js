const apiId = "5fd696c98ddd227fcb99dc2e31d10bef";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast";

const searchInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const searchCart = document.querySelector('.search-cart');


function localWeather(data) {
  document.getElementById('city').innerHTML = data.name;
  document.getElementById('temp').innerHTML = Math.round(data.main.temp) + " °C";
  document.getElementById('humidité').innerHTML = data.main.humidity + " %";
  document.getElementById('wind').innerHTML = (data.wind.speed * 3.6).toFixed(2) + " km/h";
  document.getElementById('pression').innerHTML = data.main.pressure + " hPa";
  document.getElementById('visibilité').innerHTML = (data.visibility / 1000).toFixed(1) + " km";
}


function localCartWeather(data) {

  searchCart.querySelector('.city').innerHTML = data.name;
  searchCart.querySelector('.temp').innerHTML = Math.round(data.main.temp) + " °C";
  searchCart.querySelector('.humidité').innerHTML = data.main.humidity + " %";
  searchCart.querySelector('.wind').innerHTML = (data.wind.speed * 3.6).toFixed(2) + " km/h";
  searchCart.querySelector('.pression').innerHTML = data.main.pressure + " hPa";
  searchCart.querySelector('.visibilité').innerHTML = (data.visibility / 1000).toFixed(1) + " km";
}



async function checkWeatherByCoords(lat, lon) {
  const url = `${apiUrl}?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiId}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
    localCartWeather(data);  
    localWeather(data);     


    const forecastUrl = `${apiUrlForecast}?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiId}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    updateWeatherCards(forecastData);
    updateWeatherCardsjours(forecastData);
    createTemperatureChart(forecastData);
    createDailyTemperatureChart(forecastData)


  } 
  
  else {
    alert("Erreur lors de la récupération des données météo.");
  }
}

async function checkWeather(city) {
  const url = `${apiUrl}?q=${city}&units=metric&lang=fr&appid=${apiId}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
    localCartWeather(data);

    const forecastUrl = `${apiUrlForecast}?q=${city}&units=metric&lang=fr&appid=${apiId}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    updateWeatherCards(forecastData); // ici on utilise les données forecast
    updateWeatherCardsjours(forecastData); 
    createTemperatureChart(forecastData);
    createDailyTemperatureChart(forecastData)

  } else {
    alert("Ville non trouvée !");
  }
}


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      checkWeatherByCoords(lat, lon);
    },
    (err) => {
      alert("Impossible de récupérer votre position.");
    }
  );
} else {
  alert("La géolocalisation n'est pas supportée par votre navigateur.");
}

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) {
    checkWeather(city);
  } else {
    alert("Entrez un nom de ville !");
  }
});



function getForecastByCoords(lat, lon) {
  fetch(`${apiUrlForecast}?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiId}`)
    .then(res => res.json())
    .then(data => {
      updateWeatherCards(data);
    })
    .catch(err => console.log(err));
}



function formatHour(dateTime) {
  const hour = new Date(dateTime).getHours();
  return `${hour.toString().padStart(2, '0')}:00`;
}

function updateWeatherCards(data) {
  const container = document.querySelector('.prevesions'); 
  container.innerHTML = ''; 

  const cityNameElement = document.querySelector('.forecast-city-name');
  cityNameElement.textContent = `${data.city.name}`;

  const hourlyData = data.list.slice(0, 8);

  hourlyData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'cardContainer';

    card.innerHTML = `
      <div class="card">
       <div class="weather-header">
       <div class="weather-header-title">
        <h4 class="hour">${formatHour(item.dt_txt)}</h4>
       </div>
       
       <div class="weather-header-description">
      <h3 class="weather ${getWeatherColorClass(item.weather[0].main)}">${item.weather[0].main}</h3>
        <p class="weather-description">${item.weather[0].description}</p>
       </div>
       </div>
       
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Icon">
        <p class="temp">${Math.round(item.main.temp)}°C</p>
        <div class="minmaxContainer">
          <div class="min">
            <p class="minHeading">Min</p>
            <p class="minTemp">${Math.round(item.main.temp_min)}°C</p>
          </div>
          <div class="max">
            <p class="maxHeading">Max</p>
            <p class="maxTemp">${Math.round(item.main.temp_max)}°C</p>
          </div>
        </div>
        <div class="weather-description-infos">
          <h4>
            <i class="fa-solid fa-wind"></i>
            <span class="wind">${(item.wind.speed * 3.6).toFixed(2)} km/h</span>

          </h4>
          <h4>
            <i class="fa-regular fa-eye"></i>
            <span class="visibility">${(item.visibility / 1000).toFixed(1)} km</span>
          </h4>
          <h4>
            <i class="fa-solid fa-down-long"></i>
            <span class="humidity">${item.main.humidity}%</span>
          </h4>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function getWeatherColorClass(condition) {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'weather-clear';
    case 'rain':
      return 'weather-rain';
    case 'clouds':
      return 'weather-clouds';
    case 'snow':
      return 'weather-snow';
    case 'thunderstorm':
      return 'weather-thunder';
    default:
      return 'weather-default';
  }
}


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getForecastByCoords(latitude, longitude);
  }, () => {
    alert("Autorise l'accès à la localisation pour voir la météo locale.");
  });
}


//prevesion jours


function updateWeatherCardsjours(data) {
  const container = document.querySelector('.prevesions-5jours');
  container.innerHTML = '';
 const cityNameElement = document.querySelector('.forecastJour-city-name');
  cityNameElement.textContent = `${data.city.name}`;
  // Regrouper par jour
  const daysMap = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daysMap[date]) {
      daysMap[date] = [];
    }
    daysMap[date].push(item);
  });

  const allDays = Object.keys(daysMap).slice(0, 5); // les 5 premiers jours

  allDays.forEach(date => {
    const dayData = daysMap[date][0]; // On prend la 1ère entrée de chaque jour
    const card = document.createElement('div');
    card.className = 'daily-card';

    const dayName = new Date(date).toLocaleDateString('fr-FR', { weekday: 'long' });

    card.innerHTML = `
      <h3>${dayName}</h3>
      <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="icon">
      <h3 class="weather ${getWeatherColorClass(dayData.weather[0].main)}">${dayData.weather[0].main}</h3>
      <p>${dayData.weather[0].description}</p>
      <p>Temp: ${Math.round(dayData.main.temp)}°C</p>
      <p>Humidité: ${dayData.main.humidity}%</p>
      <p>Vent: ${(dayData.wind.speed * 3.6).toFixed(1)} km/h</p>
    `;

    container.appendChild(card);
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    getForecastByCoords(latitude, longitude);
  }, () => {
    alert("Autorise l'accès à la localisation pour voir la météo locale.");
  });
}


//chart
function createTemperatureChart(data) {
  const hours = data.list.slice(0, 8).map(item => {
    return new Date(item.dt_txt).getHours() + 'h';
  });

  const temperatures = data.list.slice(0, 8).map(item => {
    return Math.round(item.main.temp);
  });

  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Température (°C)',
        data: temperatures,
        borderColor: 'rgba(236, 108, 69, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: 'blue',
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}


function createDailyTemperatureChart(data) {
  const daysMap = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daysMap[date]) {
      daysMap[date] = [];
    }
    daysMap[date].push(item.main.temp); //stocke les températures
  });

  const labels = [];
  const dailyAvgTemps = [];

  Object.keys(daysMap).slice(0, 5).forEach(date => {
    const temps = daysMap[date];
    const avgTemp =
      temps.reduce((sum, t) => sum + t, 0) / temps.length;

    const dayName = new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long'
    });

    labels.push(dayName);
    dailyAvgTemps.push(avgTemp.toFixed(1));
  });

  const ctx = document.getElementById('dailyChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Température moyenne (°C)',
        data: dailyAvgTemps,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'red'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}





















