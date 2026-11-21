// Add your OpenWeatherMap API key below. Keep this file in scripts/.
const OPENWEATHER_API_KEY = "3bda5b9e51fabea2a1826f04417afc93";
const WEATHER_CITY = "Dallas,US";
const WEATHER_UNITS = "imperial";

const currentWeatherElement = document.querySelector("#current-weather");
const forecastElement = document.querySelector("#weather-forecast");

function showWeatherError(message) {
    if (currentWeatherElement) currentWeatherElement.textContent = message;
    if (forecastElement) forecastElement.textContent = "Forecast unavailable.";
}

function weatherIcon(iconCode, description) {
    const image = document.createElement("img");
    image.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    image.alt = description;
    image.width = 76;
    image.height = 76;
    return image;
}

function renderCurrentWeather(data) {
    currentWeatherElement.replaceChildren();
    const condition = data.weather[0];
    currentWeatherElement.append(weatherIcon(condition.icon, condition.description));
    const details = document.createElement("div");
    const temperature = document.createElement("div");
    temperature.className = "current-temp";
    temperature.textContent = `${Math.round(data.main.temp)}°F`;
    const description = document.createElement("p");
    description.className = "current-description";
    description.textContent = condition.description;
    details.append(temperature, description);
    currentWeatherElement.append(details);
}

function renderForecast(data) {
    const timezoneOffset = data.city.timezone;
    const days = new Map();

    data.list.forEach((entry) => {
        const localDate = new Date((entry.dt + timezoneOffset) * 1000);
        const key = `${localDate.getUTCFullYear()}-${localDate.getUTCMonth()}-${localDate.getUTCDate()}`;
        if (!days.has(key)) {
            days.set(key, { date: localDate, min: entry.main.temp_min, max: entry.main.temp_max });
        } else {
            const day = days.get(key);
            day.min = Math.min(day.min, entry.main.temp_min);
            day.max = Math.max(day.max, entry.main.temp_max);
        }
    });

    const today = new Date(Date.now() + timezoneOffset * 1000);
    const todayKey = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;
    const forecastDays = [...days.entries()].filter(([key]) => key !== todayKey).slice(0, 3);
    forecastElement.replaceChildren();

    forecastDays.forEach(([, day]) => {
        const card = document.createElement("div");
        card.className = "forecast-day";
        const label = document.createElement("strong");
        label.textContent = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(day.date);
        const highLow = document.createElement("span");
        highLow.textContent = `${Math.round(day.max)}° / ${Math.round(day.min)}°`;
        card.append(label, highLow);
        forecastElement.append(card);
    });

    if (!forecastDays.length) forecastElement.textContent = "Forecast unavailable.";
}

async function loadWeather() {

    const query = `q=${encodeURIComponent(WEATHER_CITY)}&units=${WEATHER_UNITS}&appid=${OPENWEATHER_API_KEY}`;
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?${query}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}`)
        ]);
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error();
        }
        const [currentData, forecastData] = await Promise.all([currentResponse.json(), forecastResponse.json()]);
        renderCurrentWeather(currentData);
        renderForecast(forecastData);
    } catch (error) {
        console.error("Weather loading error");
        showWeatherError("Weather data is temporarily unavailable.");
    }
}

loadWeather();
