// Global variables
var apiKey = "dc53cc5314c624a5f09f85697c8801a7"
var searchBtn = document.querySelector("#search-button");
var cityInputEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#fiveday-forecast");
var searchHistoryEl = document.querySelector("#search-history");

// Function to get weather data for a city
function getCityWeather(city) {
    var apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" +
        apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data);
                    getCityForecast(data.coord.lat, data.coord.lon);
                    saveSearchHistory(city);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap");
        });
}

// Function to display current weather data for a city
function displayCurrentWeather(data) {
    currentWeatherEl.innerHTML = "";

    var cityEl = document.createElement("h2");
    cityEl.textContent = data.name + " (" + new Date().toLocaleDateString() + ")";

    var iconEl = document.createElement("img");
    iconEl.setAttribute(
        "src",
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
    );

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + data.main.temp + " °F";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.main.humidity + "%";

    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + data.wind.speed + " MPH";

    currentWeatherEl.appendChild(cityEl);
    currentWeatherEl.appendChild(iconEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(windEl);
}

// Function to get 5-day forecast data for a city
function getCityForecast(lat, lon) {
    var apiUrl =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=" +
        apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCityForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap");
        });
}

// Function to display 5-day forecast data for a city
function displayCityForecast(data) {
    forecastEl.innerHTML = "";

    for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var forecastCardEl = document.createElement("div");
            forecastCardEl.classList = "card bg-primary text-white m-2";

            var forecastDateEl = document.createElement("h5");
            forecastDateEl.textContent = new Date(
                data.list[i].dt_txt
            ).toLocaleDateString();

            var forecastIconEl = document.createElement("img");
            forecastIconEl.setAttribute(
                "src",
                "https://openweathermap.org/img/w/" +
                data.list[i].weather[0].icon +
                ".png"
            );

            var forecastTempEl = document.createElement("p");
            forecastTempEl.innerHTML =
                "Temp: " +
                Math.round((data.list[i].main.temp - 273.15) * 1.8 + 32) +
                " &#176;F";

            var forecastHumidityEl = document.createElement("p");
            forecastHumidityEl.innerHTML =
                "Humidity: " + data.list[i].main.humidity + "%";

            forecastCardEl.appendChild(forecastDateEl);
            forecastCardEl.appendChild(forecastIconEl);
            forecastCardEl.appendChild(forecastTempEl);
            forecastCardEl.appendChild(forecastHumidityEl);

            forecastEl.appendChild(forecastCardEl);
        }
    }
};