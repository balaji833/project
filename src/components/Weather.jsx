import React, { useEffect, useState } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import bin_icon from '../assets/bin.png';
import cloudy_icon from '../assets/cloudy.png';
import rainy_icon from '../assets/rainy.png';
import storm_icon from '../assets/storm.png';
import sun_icon from '../assets/sun.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import snow_icon from '../assets/snow.png';

const Weather = () => {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);

  const iconMapping = {
    "clear-day": sun_icon,
    "clear-night": sun_icon,
    "partly-cloudy-day": cloudy_icon,
    "partly-cloudy-night": cloudy_icon,
    "cloudy": cloudy_icon,
    "rain": rainy_icon,
    "snow": snow_icon,
    "thunderstorm": storm_icon,
  };

  const search = async (cityName) => {
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=us&key=FTB22H28YABFQS73YJUFMNMJ4&contentType=json`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.currentConditions) {
        console.error("Invalid weather data");
        return;
      }

      const icon = iconMapping[data.currentConditions.icon] || sun_icon;

      setWeatherData({
        humidity: data.currentConditions.humidity,
        windSpeed: data.currentConditions.windspeed,
        temperature: Math.round(data.currentConditions.temp),
        location: data.resolvedAddress,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search(city);
  }, []);

  const handleSearch = () => {
    if (city.trim() !== '') {
      search(city);
    }
  };

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          type="text"
          placeholder='Search'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img src={search_icon} alt="search" onClick={handleSearch} />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt='weather icon' className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°F</p>
          <p className='location'>{weatherData.location}</p>

          <div className='weather-data'>
            <div className='col'>
              <img src={humidity_icon} alt='humidity' />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind_icon} alt='wind' />
              <div>
                <p>{weatherData.windSpeed} mph</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Weather;
