import search from "../icons/search.png";
import clearsky from "../images/clearsky.png";
import PhnomPenh from '../images/PhnomPenh.jpg';
import celsious from '../images/celsious.png'
import fahrenheit from '../images/fahrenheit (1).png'
import girl from '../images/girl.png'
import sunny from '../images/sunny.png';
import { useState, useEffect } from "react";
import bg from '../images/bg.jpg';
import rain from '../images/rain.png';
import wind_icon from '../images/wind_icon.png';
import PolarChart from "./PolarChart";
import humidity from '../images/humidity.png'
import sunrise from '../images/sunrise.png';
import sunset from '../images/sunset.png';

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
    const [city, setCity] = useState("");
    const [week, setWeek] = useState([]);
    const [unit, setUnit] = useState('C');
    const [currentWeather, setCurrentWeather] = useState(null);

    useEffect(() => {
        if (city) {
            handleSearch();
        }
    }, [city]);

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

    // search function
    async function handleSearch() {
        if (!city) return;
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );
        const geoData = await geoRes.json();
        if (!geoData.results) return;
        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&current_weather=true&timezone=auto`
        );
        const data = await weatherRes.json();
        const forecast = data.daily.time.map((day, i) => ({
            day: new Date(day).toLocaleDateString("en-US", {
                weekday: "long",
            }),
            temp: data.daily.temperature_2m_max[i],
        }));
        setWeek(forecast);

        if (data.current_weather) {
            const weatherInfo = getWeatherInfo(data.current_weather.weathercode);
            setCurrentWeather({
                temp: data.current_weather.temperature,
                time: data.current_weather.time,
                windspeed: data.current_weather.windspeed,
                description: weatherInfo.description,
                icon: weatherInfo.icon,
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
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        console.log("weatherData", weatherData);
    }

    return (
        <div className=" w-full h-auto rounded-3xl flex">
            {/* Left div */}

            <div className=" w-[25%] h-full  items-center py-4">
                <div className="w-full h-12 flex items-center rounded-lg gap-2 px-4 ">
                    {/* search weather here */}
                    <select className="
                            w-[90%]
                            h-12
                            bg-white
                            border border-gray-300
                            rounded-xl
                            ml-4
                            px-4
                            text-gray-700
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            transition-all
                            cursor-pointer
                        "
                        value={city}
                        onChange={(e) => {
                            const selectedCity = e.target.value;
                            setCity(selectedCity);
                        }}
                    >
                        <option value="">Select a city</option>
                        {cities.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
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

                {/* image at the end */}
                <div className="w-full h-44 overflow-hidden mt-18 px-4 relative rounded-2xl">
                    <img
                        className="w-full h-full object-cover rounded-2xl"
                        src={PhnomPenh}
                        alt="PhnomPenh"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-2xl mx-4"></div>
                    <p className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                        Hello, {city || 'Select a city'}
                    </p>
                </div>
            </div>

            {/* Right div */}

            <div className="bg-gray-100 w-[75%] h-full px-8 py-4">
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
                <div className="relative w-full h-80 mt-4 flex items-center justify-center bg-cover bg-center rounded-2xl overflow-hidden "
                    style={{ backgroundImage: `url(${bg})` }}>
                    {/* dark overlay */}

                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 w-full flex items-center justify-around">
                        {week.length > 0 ? (
                        week.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white/20 backdrop-blur-md w-28 h-52 rounded-3xl flex flex-col items-center justify-around text-white">
                                <p>{item.day}</p>
                                <img className="w-16 h-16" src={sunny} alt="sunny" />
                                <p>{formatTemp(item.temp)}</p>
                            </div>
                        ))
                        ) : (
                        <p className=" text-2xl font-medium">Loading...</p>
                        )}
                    </div>
                </div>

                <div className="bg-purple-200 w-full h-200 pr-0">
                    <p className="py-8 text-3xl">Today's Highlight</p>
                    <div className="grid grid-cols-3 gap-y-16 gap-10">
                        <div className="bg-red-200 h-64 rounded-2xl p-4 flex flex-col">
                            <h2 className="text-center text-lg">UV Index</h2>
                            <div className="flex-1 min-h-0 flex items-center justify-center">
                                <PolarChart />
                            </div>
                        </div>
                        <div className="bg-linear-to-br from-red-500 via-fuchsia-500 to-orange-500 h-56 rounded-2xl p-6 text-white shadow-xl">
                            <h2 className="text-lg font-semibold">Wind Status</h2>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-4xl font-bold">
                                        {currentWeather ? `${Math.round(currentWeather.windspeed)} km/h` : '...'}
                                    </p>
                                    <p className="text-sm text-white/80 mt-2">Current wind speed</p>
                                </div>
                                <div className="rounded-3xl bg-white/20 p-3">
                                    <img className="w-10 h-10" src={humidity} alt="humidity" />
                                </div>
                            </div>
                            <div className="my-4 flex items-center gap-3">
                                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium">WSW</span>
                                <p className="text-sm text-white/80">Wind direction</p>
                            </div>
                        </div>


                        <div className="bg-linear-to-br from-red-500 via-fuchsia-500 to-orange-500 h-56 rounded-2xl p-6 text-white shadow-xl">
                            <h2 className="text-lg font-semibold">Sunrise & Sunset</h2>
                            <div className="my-2 flex items-center justify-items-start">
                                <div className="rounded-3xl bg-white/20 p-3">
                                    <img className="w-10 h-10" src={sunrise} alt="sunrise" />
                                </div>
                                <div>
                                    <p className="text-4xl font-bold pl-6">
                                        {currentWeather ? `6:00 am` : '...'}
                                    </p>
                                </div>
                            </div>
                            <div className="my-2 flex items-center justify-items-start">
                                <div className="rounded-3xl bg-white/20 p-3">
                                    <img className="w-10 h-10" src={sunset} alt="sunset" />
                                </div>
                                <div>
                                    <p className="text-4xl font-bold pl-6">
                                        {currentWeather ? `6:00 pm` : '...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="bg-red-500 h-64 pl-6 pt-4 rounded-2xl"></div>
                        <div className="bg-red-500 h-64 rounded-2xl"></div> */}
                    </div>
                </div>

            </div>
        </div>
    );
}