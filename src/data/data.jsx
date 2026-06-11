const API_KEY = "e5f4997d4df91369de494768f06688da";

const response = await fetch(
  "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
);

const data = await response.json();
console.log("Response ===>  ", response);
console.log("Data ", data);


