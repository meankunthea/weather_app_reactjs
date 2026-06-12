
import clearsky from "../images/clearsky.png";
import PhnomPenh from '../images/PhnomPenh.jpg';
import celsious from '../images/celsious.png'
import fahrenheit from '../images/fahrenheit (1).png'
import girl from '../images/girl.png'
import sunny from '../images/sunny.png';
import { useState, useEffect, useRef } from "react";
import bg from '../images/bg.jpg';
import rain from '../images/rain.png';
import wind_icon from '../images/wind_icon.png';
import GaugeChart from "./GaugeChart";
import humidity from '../images/humidity.png'
import sunrise from '../images/sunrise.png';
import sunset from '../images/sunset.png';
import icon_wind from '../images/icon_wind.png'


const cities = [
    "Phnom Penh",
    "Banteay Meanchey",
    "Battambang",
    "Kampong Cham",
    "Kampong Chhnang",
    "Kampong Speu",
    "Kampong Thom",
    "Kampot",
    "Kandal",
    "Kep",
    "Koh Kong",
    "Kratie",
    "Mondulkiri",
    "Oddar Meanchey",
    "Pailin",
    "Preah Sihanouk",
    "Preah Vihear",
    "Prey Veng",
    "Pursat",
    "Ratanakiri",
    "Siem Reap",
    "Stung Treng",
    "Svay Rieng",
    "Takeo",
    "Tbong Khmum",
];

export default function Weather() {
    // const [week, setWeek] = useState([]);
    const searchRef = useRef(null);
    const [city, setCity] = useState("");
    const [week, setWeek] = useState([]);
    const [unit, setUnit] = useState('C');
    const [currentWeather, setCurrentWeather] = useState(null);
    // const [city, setCity] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    

    function formatTemp(tempC) {
        if (unit === 'C') return `${Math.round(tempC)}°C`;
        return `${Math.round(tempC * 9 / 5 + 32)}°F`;
    }

    function getWeatherInfo(code) {
        if (code === 0) return { icon: clearsky, description: 'Clear sky' };
        if (code <= 3) return { icon: clearsky, description: 'Partly cloudy' };
        if (code <= 48) return { icon: clearsky, description: 'Foggy' };
        if (code <= 67) return { icon: rain, description: 'Rainy' };
        if (code <= 77) return { icon: rain, description: 'Snowy' };
        if (code <= 82) return { icon: rain, description: 'Showers' };
        return { icon: clearsky, description: 'Windy' };
    }

    useEffect(() => {
        if (city) {
            handleSearch();
        }
    }, [city]);

    useEffect(() => {
        const savedCity = localStorage.getItem("selectedCity");

        if (savedCity) {
            setCity(savedCity);
        } else {
            setCity("Phnom Penh");
            localStorage.setItem("selectedCity", "Phnom Penh");
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
        setSearchHistory(savedHistory);
    }, []);

    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity);
        localStorage.setItem("selectedCity", selectedCity);
        saveSearchHistory(selectedCity);
        setShowSuggestions(false);
    };

    // search function
    async function handleSearch(searchCity = city) {
        if (!searchCity) return;
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}`
        );
        const geoData = await geoRes.json();
        if (!geoData.results) return;
        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code,sunrise,sunset,uv_index_max&hourly=relativehumidity_2m,visibility,us_aqi&current_weather=true&timezone=auto`
        );
        const data = await weatherRes.json();
        const forecast = data.daily.time.slice(0, 7).map((day, i) => ({
            day: i === 0 ? "Today" : new Date(day).toLocaleDateString("en-US", {
                weekday: "short",
            }),
            temp: data.daily.temperature_2m_max[i],
            date: day,
            weatherCode: data.daily.weather_code[i],
        }));

        setWeek(forecast);

        if (data.current_weather) {
            const weatherInfo = getWeatherInfo(data.current_weather.weathercode);
            const currentHourIndex = data.hourly?.time?.findIndex(
                (time) => time === data.current_weather.time
            );
            const humidity = currentHourIndex >= 0 ? data.hourly.relativehumidity_2m[currentHourIndex] : null;
            const visibility = currentHourIndex >= 0 ? data.hourly.visibility[currentHourIndex] : null;
            const aqi = currentHourIndex >= 0 ? data.hourly.us_aqi?.[currentHourIndex] : null;

            setCurrentWeather({
                temp: data.current_weather.temperature,
                time: data.current_weather.time,
                windspeed: data.current_weather.windspeed,
                description: weatherInfo.description,
                icon: weatherInfo.icon,
                sunrise: data.daily.sunrise[0],
                sunset: data.daily.sunset[0],
                humidity,
                visibility,
                aqi,
                uvIndex: data.daily.uv_index_max?.[0] ?? null,
            });
        }
    }

    // get weather from api
    async function getWeather(city) {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );
        const geoData = await geoRes.json();
        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        console.log("weatherData", weatherData);
    }

    function getWeatherImage(code) {
        if (code === 0) return sunny; // clear sky
        if (code <= 3) return clearsky; // cloudy
        if (code >= 51 && code <= 67) return rain; // drizzle/rain
        if (code >= 80 && code <= 82) return rain; // showers

        return sunny;
    }

    return (
        <div className=" w-full h-auto rounded-3xl flex">
            {/* Left div */}

            <div className=" w-[25%] h-full  items-center py-4">
                <div className="w-full h-12 flex items-center rounded-lg gap-2 px-4 ">
                    {/* search weather here */}
                    <div ref={searchRef} className="relative w-[90%] ml-4">
                        <input
                            type="text"
                            placeholder="Search province..."
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full h-12 bg-white border border-gray-300 rounded-xl px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {showSuggestions && (
                            <div className="absolute top-14 left-0 right-0 bg-white border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                {[
                                    ...searchHistory,
                                    ...cities.filter(
                                        (item) =>
                                            item
                                                .toLowerCase()
                                                .includes(city.toLowerCase()) &&
                                            !searchHistory.includes(item)
                                    ),
                                ].slice(0, 10).map((item) => (
                                    <div
                                        key={item}
                                        onClick={() => handleCitySelect(item)}
                                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Weather image */}
                <div className="flex justify-center items-center">
                    <div className="w-64 p-8">
                        <img
                            className="w-full h-auto"
                            src={clearsky}
                            alt="clearsky"
                        />
                    </div>
                </div>

                {/* Text for weather */}
                <div className=" w-full h-64 ">

                    {/* Temperature */}
                    <div className="pl-6 flex flex-col justify-center h-24 ">
                        <p className="text-5xl font-normal">
                            {currentWeather ? formatTemp(currentWeather.temp) : '—'}
                        </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center pl-6 py-2 gap-4 ">
                        <p>{currentWeather ? new Date(currentWeather.time).toLocaleDateString('en-US', { weekday: 'long' }) : 'Loading...'}</p>
                        <p className="text-gray-600">{currentWeather ? new Date(currentWeather.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--:--'}</p>
                    </div>

                    <hr className="mx-6 mt-2 border-gray-200" />

                    {/* Bottom 3 sections */}
                    <div className="flex flex-col justify-evenly flex-1 px-4 py-4 gap-3">
                        <div className="flex items-end gap-8 ">
                            <img className="w-10 h-10" src={currentWeather?.icon ?? clearsky} alt={currentWeather?.description ?? 'weather'} />
                            <h2 className=" ">{currentWeather?.description ?? 'Loading...'}</h2>
                        </div>
                        <div className="flex items-center gap-8 ">
                            <img className="w-10 h-10" src={rain} alt="rain" />
                            <h2 className=" ">{currentWeather ? `Feels like ${formatTemp(currentWeather.temp)}` : '...'}</h2>
                        </div>
                        <div className="flex items-center gap-8 ">
                            <img className="w-10 h-10" src={wind_icon} alt="wind_icon" />
                            <h2 className=" ">{currentWeather ? `${Math.round(currentWeather.windspeed)} km/h` : '...'}</h2>
                        </div>
                    </div>
                </div>

                {/* image */}
                <div className="w-full h-65  overflow-hidden mt-18 px-4 relative rounded-2xl">
                    <img
                        className="w-full h-full object-cover rounded-2xl"
                        src={PhnomPenh}
                        alt="PhnomPenh"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-2xl mx-4 "></div>
                    <p className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                        Hello, {city || 'Select a city'}
                    </p>
                </div>
            </div>

            {/* Right div */}

            <div className=" w-[75%] h-full px-8 py-4">
                <div className="w-full h-12 flex  ">
                    <div className="h-full w-[80%] flex gap-6 items-center pl-4">
                        <h2 className="border-b-2 border-black pb-1 ">Today</h2>
                        <h2 className="">Week</h2>
                    </div>
                    <div className="h-full w-[20%] flex gap-4 items-center justify-around">
                        <div className="flex gap-2">
                            <img
                                className={`w-8 h-8 rounded-full p-0.5 object-contain cursor-pointer ${unit === 'C' ? 'bg-blue-500' : 'bg-transparent'}`}
                                src={celsious}
                                alt="celsious"
                                onClick={() => setUnit('C')}
                            />
                            <img
                                className={`w-8 h-8 rounded-full p-0.5 object-contain cursor-pointer ${unit === 'F' ? 'bg-blue-500' : 'bg-transparent'}`}
                                src={fahrenheit}
                                alt="fahrenheit"
                                onClick={() => setUnit('F')}
                            />
                        </div>
                        <img className="w-8 h-8" src={girl} alt="girl" />

                    </div>
                </div>
                <div className="relative w-full h-60 mt-4 flex items-center justify-center bg-cover bg-center rounded-2xl overflow-hidden "
                    style={{ backgroundImage: `url(${bg})` }}>
                    {/* dark overlay */}

                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 w-full flex items-center justify-around">
                        {week.length > 0 ? (
                            week.map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white/20 backdrop-blur-md w-28 h-52 rounded-3xl flex flex-col items-center justify-around text-white"
                                >
                                    <p className="text-center font-bold">{item.day} <br/>{item.date}</p>
                                    <img className="w-16 h-16" src={getWeatherImage(item.weatherCode)} alt="weather"/>
                                    <p>{formatTemp(item.temp)}</p>
                                </div>
                            ))
                        ) : (
                            <p className=" text-2xl font-medium">Loading...</p>
                        )}
                    </div>
                </div>

                <div className=" w-full h-200 ">
                    <p className="py-6 text-3xl text-bold">Today's Highlight</p>
                    <div className="grid grid-cols-3 gap-y-14 gap-14">
                        {/* UV indexcard */}

                        <div className="bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 h-56 rounded-2xl p-6 shadow-xl flex flex-col">
                            <h2 className="text-lg font-semibold text-center  mb-3">UV Index</h2>
                            <div className="flex-1 min-h-0 flex items-center justify-center">
                                <GaugeChart value={currentWeather?.uvIndex ?? 0} label="UV Index" color="#fbbf24" />
                            </div>
                        </div>
                        {/* Wind card */}

                        <div className="bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 h-56 rounded-2xl p-6  shadow-xl">
                            <h2 className="text-lg font-semibold">Wind Status</h2>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold">
                                        {currentWeather ? `${Math.round(currentWeather.windspeed)} km/h` : '...'}
                                    </p>
                                    <p className="text-sm  mt-2">Current wind speed</p>
                                </div>
                                <div className="rounded-3xl bg-white/20 p-3">
                                    <img className="w-10 h-10" src={icon_wind} alt="icon_wind" />
                                </div>
                            </div>
                            <div className="my-4 flex items-center gap-3">
                                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium">WSW</span>
                                <p className=" ">Wind direction</p>
                            </div>
                        </div>

                        {/* Sunrise&sunset card */}
                        <div className="bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 h-56 rounded-2xl p-6  shadow-xl">
                            <h2 className="text-lg font-semibold">Sunrise & Sunset</h2>
                            <div className="my-2 flex items-center justify-items-start">
                                <div className="rounded-3xl bg-white/20 p-3">
                                    <img className="w-10 h-10" src={sunrise} alt="sunrise" />
                                </div>
                                <div>
                                    <p className="text-4xl font-bold pl-6">
                                        {currentWeather ? new Date(currentWeather.sunrise).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '...'}
                                    </p>
                                </div>
                            </div>
                            <div className="my-2 flex items-center justify-items-start">
                                <div className="rounded-3xl p-3">
                                    <img className="w-10 h-10" src={sunset} alt="sunset" />
                                </div>
                                <div>
                                    <p className="text-4xl font-bold pl-6">
                                        {currentWeather ? new Date(currentWeather.sunset).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Humindity card */}
                        
                        <div className="bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 h-56 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-lg font-semibold">Humidity</h2>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold">
                                        {currentWeather && currentWeather.humidity !== null ? `${Math.round(currentWeather.humidity)}%` : '...'}
                                    </p>
                                    <p className="text-sm mt-2">Current humidity</p>
                                </div>
                                <div className="rounded-3xl bg-white/20 p-3">
                                    <img className="w-10 h-10" src={humidity} alt="humidity" />
                                </div>
                            </div>
                            <div className="my-4 flex items-center gap-3">
                                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium">Humidity</span>
                            </div>
                        </div>

                        {/* Visibility card */}
                        <div className="bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 h-56 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-lg font-semibold">Visibility</h2>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold">
                                        {currentWeather && currentWeather.visibility !== null ? `${Math.round(currentWeather.visibility / 1000).toFixed(1)} km` : '...'}
                                    </p>
                                    <p className="text-sm  mt-2">Current visibility</p>
                                </div>
                            </div>
                            <div className="my-4 flex items-center gap-3">
                                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium">Visibility</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}