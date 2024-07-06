const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "8867fc7c0b453cdd5215bfd4e388c3dd";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_text.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.wind.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>(${weatherItem.dt_text.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.wind.humidity}%</h4>
                 </li>`;
    }
     
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://sapi.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_text).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML= "";

        
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforehand", createWeatherCard(cityName, weatherItem, index));

            } else {
                weatherCardsDiv.insertAdjacentHTML("beforehand", createWeatherCard(cityName, weatherItem, index));
            }
            
           
        });

    }).catch(() =>{
            alert("An error occurred while fetching the coordinates!");
    });
    
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for $(cityName)`);
        const { name, lat, lon  } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() =>{
        alert("An error occurred while fetching the coordinates!");
    });
    
}

searchButton.addEventListener("click", getCityCoordinates);