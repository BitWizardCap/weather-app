import { useState, useEffect } from 'react';
import axios from 'axios';
import iso3166 from 'iso-3166-1-alpha-2';
import './App.css';

const weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [countryCode, setCountryCode] = useState('');

  const convertCountry = () => {
    try {
      const code = iso3166.getCode(country);
      setCountryCode(code);
    } catch (error) {
      setCountryCode('');
    }
  };

  const fetchWeatherData = async () => {
    try {
      if(city && countryCode) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${weatherApiKey}`);
        setWeatherData(response.data);
        addToSearchHistory(`${city}, ${country}`);
      } else {
        console.error('Input correct value');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const addToSearchHistory = (searchItem) => {
    setSearchHistory([searchItem, ...searchHistory]);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleSearch = () => {
    if (city && country) {
      fetchWeatherData();
    } else {
      console.log('here')
    }
  };

  const handleDeleteFromHistory = (index) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
  };

  const handleSeachFromHistory = async (index) => {
    const updatedHistory = [...searchHistory];
    const searchArr = updatedHistory[index].split(",");
    setCity(searchArr[0]);
    setCountry(searchArr[1]);

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchArr[0]},${searchArr[1]}&appid=${weatherApiKey}`);
    setWeatherData(response.data);
  };
  
  useEffect(() => {
    convertCountry();
  }, [country]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Today's Weather</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
        <button
          onClick={() => {
            setCity('');
            setCountry('');
          }}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
        >
          Clear
        </button>
      </div>
      {weatherData && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            {city}, {country}
          </h2>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">Search History</h3>
        <ul className="mb-4">
          {searchHistory.map((item, index) => (
            <li key={index} className="flex items-center justify-between border-b py-2">
              <span>{item} - {new Date().toLocaleTimeString()}</span>
              <div>
                <button
                  onClick={() => handleSeachFromHistory(index)}
                  className="text-gray-700 px-4"
                >
                  Search
                </button>
                <button
                  onClick={() => handleDeleteFromHistory(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              
            </li>
          ))}
        </ul>
        <button
          onClick={clearSearchHistory}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
        >
          Clear History
        </button>
      </div>
    </div>
  );
}

export default App;
