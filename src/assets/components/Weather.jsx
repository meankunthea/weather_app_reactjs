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

export default function Weather() {
    // const [week, setWeek] = useState([]);
    const [city, setCity] = useState("");
    const [week, setWeek] = useState([]);

    // search function
    async function handleSearch() {
        if (!city) return;
        // 1. Get coordinates from city name
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );
        const geoData = await geoRes.json();
        if (!geoData.results) return;
        const { latitude, longitude } = geoData.results[0];
        // 2. Get weather
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`
        );
        const data = await weatherRes.json();
        // 3. Convert to array
        const forecast = data.daily.time.map((day, i) => ({
            day: new Date(day).toLocaleDateString("en-US", {
                weekday: "long",
            }),
            temp: data.daily.temperature_2m_max[i],
        }));
        setWeek(forecast);
        console.log("weatherData", forecast);
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

            <div className=" w-[25%] h-full  items-center  ">
                <div className="w-full h-12 flex items-center rounded-lg gap-2 pl-6 ">
                    {/* search weather here */}
                    <div className=" bg-red-600 opacity-20 w-full h-10 flex items-center  rounded-lg gap-2 ">
                        <img className="w-5 h-5 opacity-80" src={search} alt="search" />
                        <input
                            type="text"
                            placeholder="Search places..."
                            className="flex-1 bg-transparent outline-none text-black placeholder-gray-300"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button onClick={handleSearch} className="bg-white text-black px-4 py-1  rounded-md text-sm font-medium hover:bg-gray-400 active:scale-95 transition">
                            Search
                        </button>
                    </div>
                </div>

                {/* Weather image */}
                <div className=" w-full h-full p-12">
                    <img className="" src={clearsky} alt="clearsky" />
                </div>

                {/* Text for weather */}
                <div className=" w-full h-64 ">

                    {/* Temperature */}
                    <div className="pl-6 flex items-center h-12  ">
                        <h1 className="text-xl ">32°C</h1>
                    </div>

                    {/* Date */}
                    <div className="flex items-center pl-6 py-2 gap-4 ">
                        <p>Wednesday</p>
                        <p className="text-gray-600">4: 00 PM</p>
                    </div>

                    <hr className="mx-6 mt-2 border-gray-200" />

                    {/* Bottom 3 sections */}
                    <div className="flex flex-col justify-evenly flex-1 px-4 py-2 gap-3">
                        <div className="flex items-end gap-4 ">
                            <img className="w-10 h-10" src={clearsky} alt="clearsky" />
                            <h2 className=" ">Mostly cloudy</h2>
                        </div>
                        <div className="flex items-center gap-4 ">
                            <img className="w-10 h-10" src={rain} alt="rain" />
                            <h2 className=" ">Rain-21°C</h2>
                        </div>
                        <div className="flex items-center gap-4 ">
                            <img className="w-10 h-10" src={wind_icon} alt="wind_icon" />
                            <h2 className=" ">Wind</h2>
                        </div>
                    </div>
                </div>

                {/* image at the end */}
                <div className=" w-full h-44 overflow-hidden mt-4 pl-4">
                    <img className="w-full h-full object-cover rounded-2xl" src={PhnomPenh} alt="PhnomPenh" />
                </div>
            </div>

            {/* Right div */}

            <div className="bg-blue-400 w-[75%] h-full px-8">
                <div className="bg-green-200 w-full h-12 flex  ">
                    <div className="bg-red-400 h-full w-[80%] flex gap-6 items-center pl-4">
                        <h2 className="border-b-2 border-black pb-1 ">Today</h2>
                        <h2 className="">Week</h2>
                    </div>
                    <div className="bg-pink-400 h-full w-[20%] flex gap-4 items-center justify-around">
                        <div className="flex gap-2">
                            <img className="w-8 h-8" src={celsious} alt="celsious" />
                            <img className="w-8 h-8" src={fahrenheit} alt="fahrenheit" />
                        </div>
                        <img className="w-8 h-8" src={girl} alt="girl" />

                    </div>
                </div>
                <div className="relative w-full  h-80 flex items-center justify-center bg-cover bg-center rounded-2xl overflow-hidden "
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
                                <p>{item.temp}°C</p>
                            </div>
                        ))
                        ) : (
                        <p className=" text-2xl font-medium">Loading...</p>
                        )}
                    </div>
                </div>

                <div className="bg-purple-200 w-full h-200 pl-4 pr-0">
                    <p className="pt-14 text-3xl">Today's Highlight</p>
                    <div className="grid grid-cols-3 gap-y-16 gap-10 pt-12">
                        <div className="bg-red-200 h-64 rounded-2xl p-4 flex flex-col">
                            <h2 className="text-center text-lg">UV Index</h2>
                            <div className="flex-1 min-h-0 flex items-center justify-center">
                                <PolarChart />
                            </div>
                        </div>
                        <div className="bg-red-500 h-64 pl-6 pt-4  rounded-2xl">
                            <h2 className=" text-lg">Wind Status</h2>
                            <h1 className=" text-3xl pt-12">220 km/h</h1>
                            <div className=" flex pt-12 gap-2 items-end">
                                <img className="w-8 h-8 rotate-25" src={humidity} alt="humidity" />
                                <h2 className="text-xl transform: rotate(45deg)">WSW</h2>
                            </div>
                        </div>
                        <div className="bg-red-500 h-64 pl-6 pt-4 rounded-2xl ">
                            <h2 className="text-lg">Sunrise& Sunset</h2>
                            <div className="pt-6 ">
                                <div className="flex gap-4 pt-2">
                                    <img className="w-14 h-14 " src={sunrise} alt="sunrise" />
                                    <p className="">6:00 am</p>
                                    
                                </div>
                            <div className="flex gap-4 pt-2">
                                <img className="w-14 h-14 " src={sunset} alt="sunset" />
                                <p className="">6:00 pm</p>
                                
                            </div>
                            </div>                          
                        </div>
                        <div className="bg-red-500 h-64 pl-6 pt-4 rounded-2xl"></div>
                        <div className="bg-red-500 h-64 rounded-2xl"></div>
                        <div className="bg-red-500 h-64 rounded-2xl"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}