import search from "../icons/search.png";
import clearsky from "../images/clearsky.png";
import PhnomPenh from '../images/PhnomPenh.jpg';
import celsious from '../images/celsious.png'
import fahrenheit from '../images/fahrenheit (1).png'
import girl from '../images/girl.png'
import sunny from '../images/sunny.png';
import { useState, useEffect } from "react";

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
    // <div className=" h-screen flex items-center justify-center">
        <div className="bg-gray-200 w-full h-auto rounded-3xl flex">
            {/* Left div */}

            <div className="bg-red-200 w-[25%] h-full  items-center  ">
                {/* <div className="bg-pink-600 w-full h-12   gap-6 flex justify-center items-center"> */}
                    {/* Search places */}
                    {/* <img className="w-[25px] h-[25px] text-center " src={search} alt="search" />
                    <h3>Search places...</h3>
                </div> */}
                <div className="w-full h-12 flex items-center rounded-lg gap-3 ">
                    <div className="bg-white opacity-20 w-[98%] h-10 flex items-center p-4 rounded-xl gap-3">
                        <img className="w-5 h-5 opacity-80" src={search} alt="search" />

                        <input
                            type="text"
                            placeholder="Search places..."
                            className="flex-1 bg-transparent outline-none text-black placeholder-gray-300"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />

                        <button
                            onClick={handleSearch}
                            className="bg-white  px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-100 active:scale-95 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="bg-green-200 w-full h-[40%]">
                    <img className="" src={clearsky} alt="clearsky" />
                </div>
                <div className="bg-pink-200 w-full h-[35%]">
                    <div className="bg-gray-200 w-full h-[20%] text-3xl"><h1>32°C</h1> </div>
                    <div className="bg-red-200 w-full h-[20%] flex items-center justify-center">Wednesday, 4:00</div>
                    <div className="bg-purple-200 w-full h-[20%]">
                        <hr className="border-t border-red-400 my-4 flex items-center justify-center" />
                    </div>
                    <div className="bg-blue-200 w-full h-[20%] flex">
                        <div className="bg-gray-600 h-full w-[30%] ">
                            <img className="w-18 h-18 " src={clearsky} alt="clearsky" />
                        </div>
                        <div className="bg-red-600 h-full w-[70%]">
                            <h2 className="text-center">Mostly cloudy.</h2>
                        </div>
                    </div>
                    <div className="bg-gray-200 w-full h-[20%] flex">
                        <div className="bg-gray-600 h-full w-[30%] ">
                            <img className="w-18 h-18 " src={clearsky} alt="clearsky" />
                        </div>
                        <div className="bg-green-600 h-full w-[70%]">
                            <h2 className="text-center">Rain-55°C </h2>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-200 w-full h-[15%] overflow-hidden">
                    <img className="w-full h-full object-cover rounded-3xl" src={PhnomPenh} alt="PhnomPenh" />
                </div>
            </div>

            {/* Right div */}

            <div className="bg-blue-400 w-[75%] h-full">
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
                <div className="bg-red-200 w-full h-82 flex items-center justify-around">
                    {week.length > 0 ? (
                        <div className="bg-red-200 w-full h-82 flex items-center justify-around">
                            {week.map((item, i) => (
                            <div key={i} className="bg-gray-400 w-28 h-52 rounded-3xl grid">
                                <p className="text-center mt-8">{item.day}</p>

                                <div className="flex justify-center items-center -mt-8">
                                <img className="w-16 h-16" src={sunny} alt="sunny" />
                                </div>

                                <p className="text-center">{item.temp}°C</p>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <div>Loading...</div>
                    )}
                </div>
                <div className="bg-purple-200 w-full h-300"> 
                    <p className="p-4 text-3xl">Today's Highligh</p>
                    <div className="grid grid-cols-3 gap-8 justify-between p-4" >
                        <div className="bg-red-500 w-64 h-64 rounded-2xl"></div>
                        <div className="bg-red-500 w-64 h-64 rounded-2xl"></div>
                        <div className="bg-red-500 w-64 h-64 rounded-2xl"></div>
                        <div className="bg-red-500 w-64 h-64 rounded-2xl"></div>
                        <div className="bg-red-500 w-64 h-64 rounded-2xl"></div>
                        <div className="bg-red-500 w-64 h-64 rounded-2xl"></div>
                    </div>
                </div>

            </div>
        </div>
    // </div>
  );
}