import React,{useEffect, useState} from 'react'
import './DisplayWeather.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { WiHumidity } from 'react-icons/wi'
import { SiWindicss } from 'react-icons/si'
import { RiLoaderFill } from "react-icons/ri";

type Location = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
};

type Condition = {
  text: string;
  icon: string;
};

type CurrentWeather = {
  last_updated: string;
  temp_c: number;
  temp_f: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  humidity: number;
};

type WeatherData = {
  location: Location;
  current: CurrentWeather;
};

const DisplayWeather: React.FC = () => {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);
  const fetchCurrentWeather = async (
    lat: number,
    long: number
  ): Promise<WeatherData | null> => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=aa9a58cdfd524d1d99361851241701&q=${lat},${long}`
      );
      const data = await res.json();
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorData(error.message || "An error Ocurred");
    }
    return null;
  };

  const fetchSearchedCityWeather = async (
    location: string
  ): Promise<WeatherData | null> => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=aa9a58cdfd524d1d99361851241701&q=${location}`
      );
      if (res.ok) {
        const data = await res.json();
        setData(data);
        setIsLoading(true);
        return data;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorData(error.message || "An Error Ocurred");
    }
    return null;
  };

  const handleSearch = () => {
    if (location.trim().length === 0) {
      return;
    }
    setIsLoading(false);
    fetchSearchedCityWeather(location);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
          setData(currentWeather);
          setIsLoading(true);
        }
      );
    });
  }, []);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>
        {data && isLoading ? (
          <>
            <div className="weatherArea">
              <h1 className="location">{data?.location.name}</h1>
              <span className="country">{data?.location.country}</span>
              <div className="icon">
                <img
                  src={data?.current.condition.icon}
                  alt="weather-condition"
                />
              </div>
              <h1 className="location">{data?.current.temp_c}</h1>
              <h2 className="condition">{data?.current.condition.text}</h2>
            </div>
            <div className="bottomInfoArea">
              <div className="humidity">
                <WiHumidity className="humidIcon" />
                <div className="humidInfo">
                  <h1>{data?.current.humidity}</h1>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="wind">
                <SiWindicss className="windIcon" />
                <div className="humidInfo">
                  <h1>{data?.current.wind_kph} km/h</h1>
                  <p>Wind Speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="loading">
              <RiLoaderFill className="loadingIcon" />
              <p>Loading...</p>
            </div>
          </>
        )}
        {errorData && (
          <div className="error">
            <p>{errorData}</p>
          </div>
        )}
        <div className="footer">
          Designed & Developed by &copy; Nirmal Kumar
        </div>
      </div>
    </div>
  );
};

export default DisplayWeather