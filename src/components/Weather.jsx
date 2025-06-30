import React, { useRef, useState, useEffect } from 'react';
import './Weather.css';

import storm_icon from '../assets/storm.png';
import search_icon from '../assets/search.jpg';
import sun_icon from '../assets/sun.png'; 
import wind_icon from '../assets/wind.png';
import weather_icon from '../assets/weather.png';
import rain_icon from '../assets/rain.png'; 

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "5ee13bab441e87f005d35141604d5c79";

  const weatherIconMap = React.useMemo(() => ({
    "01d": rain_icon,
    "01n": rain_icon,
    "02d": weather_icon,
    "03n": wind_icon,
    "03d": wind_icon,
    "04d": sun_icon,
    "04n": rain_icon,
    "09d": wind_icon,
    "09n": storm_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": storm_icon,
    "11n": storm_icon,
    "13d": rain_icon,
    "13n": rain_icon,
    "50d": rain_icon,
    "50n": wind_icon,
  }), []);

  const fetchWeather = React.useCallback(async (city) => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    try {
      setError("");
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID || API_KEY}` // Use VITE_APP_ID from .env or fallback to API_KEY
      );

      if (!res.ok) {
        throw new Error("City not found or invalid API key");
      }

      const data = await res.json();
      console.log(data);
        const icon = weatherIconMap[data.weather[0].icon] || rain_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        condition: data.weather[0].main,
        cloudiness: data.clouds ? data.clouds.all : undefined,
        rain: data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0,
        wind: data.wind.speed,
      });
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch weather. Check city name or API key.");
    }
  }, [API_KEY, weatherIconMap]);

  useEffect(() => {
    fetchWeather("New York"); // Default city
  }, [fetchWeather]);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search city..." />
        <img src={search_icon} alt="Search" onClick={() => fetchWeather(inputRef.current.value)} />
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="weather" className="weather-icon" />
          <div className="weather-details">
            <div className="col">
              <img src={rain_icon} alt="" />
              <div>
                <p>{weatherData.rain !== undefined ? weatherData.rain : '97'}%</p>
                <span>Rainy</span>
              </div>
            </div>
            <div className="col">
              <img src={storm_icon} alt="" />
              <div>
                <p>{weatherData.condition !== undefined ? weatherData.condition : 'Bad'}</p>
                <span>Condition</span>
              </div>
            </div>
            <div className="col">
              <img src={weather_icon} alt="" />
              <div>
                <p>{weatherData.weather !== undefined ? weatherData.weather : '10'}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.wind !== undefined ? weatherData.wind : '54'} Km/h</p>
                <span>Wind</span>
              </div>
            </div>

             <div className="col">
              <img src={sun_icon} alt="" />
              <div>
                <p>{weatherData.sun !== undefined ? weatherData.sun : 'N/A'}</p>
                <span>Sunny</span>
              </div>
            </div>

            <div className="col">
              <img src={rain_icon} alt="" />
              <div>
                <p>{weatherData.rain !== undefined ? weatherData.rain : '94'} %</p> 
                <span>Rainy</span>
              </div>
            </div>

            <div className="col">
              <img src={sun_icon} alt="" />
              <div>
                <p>{weatherData.sun !== undefined ? weatherData.sun : '6'} %</p> 
                <span>Sunny</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
