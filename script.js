const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "8867fc7c0b453cdd5215bfd4e388c3dd";

const createWeatherCard = (cityName, weatherItem, index) => {
    console.log(weatherItem)
    if(index === 0) {
        return `<div class="details">
                    <h2>${cityName} (${dayjs.unix(weatherItem.dt).format("MM/DD/YY")})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp)} F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>(${dayjs.unix(weatherItem.dt).format("MM/DD/YY")})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                    <h4>Temp: ${(weatherItem.main.temp)} F</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                 </li>`;
    }
     
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial
`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
       
       
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML= "";
        const currentWeather=data.list[0]
        currentWeatherDiv.innerHTML=createWeatherCard(cityName, currentWeather, 0);
        for(let i=1;i<data.list.length;i+=8){
            weatherCardsDiv.innerHTML+=createWeatherCard(data.name, data.list[i], 1);
        }
        
    }).catch((error) =>{
        console.log(error.message)
            alert("An error occurred while fetching the weather!");
    });
    
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); 
    if(!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        console.log(data)
        if(!data.length) return alert(`No coordinates found for $(cityName)`);
        const { name, lat, lon  } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch((error) =>{
        console.log(error)
         alert("An error occurred while fetching the coordinates!");
    });
    
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit={limit}&appid=${API_KEY}`;

            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() =>{
                alert("An error occurred while fetching the city!");
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.")
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());