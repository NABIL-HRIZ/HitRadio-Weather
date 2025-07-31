const apiId = "5fd696c98ddd227fcb99dc2e31d10bef";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

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
  } else {
    alert("Erreur lors de la récupération des données météo.");
  }
}

async function checkWeather(city) {
  const url = `${apiUrl}?q=${city}&units=metric&lang=fr&appid=${apiId}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod === 200) {
    localCartWeather(data);
  } else {
    alert("Ville non trouvée !");
  }
}

// Initialisation automatique par géolocalisation
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
