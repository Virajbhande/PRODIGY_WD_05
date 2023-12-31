"use strict";

const API = "3f61b98aeb44cbbec630514f83c45c88";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

dateEl.textContent = date + " " + month + " " + year;

const formEl = document.querySelector("form");

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (inputEl.value !== "") {
    const search = inputEl.value;
    inputEl.value = "";
    findLocation(search);
  } else {
    console.log("Please Enter City or Country Name");
  }
});

async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";

  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    if (result.cod !== "404") {
      const weatherCondition = result.weather[0].main;
      setBodyBackground(weatherCondition);

      const ImageContent = displayImageContent(result);
      const rightSide = rightSideContent(result);

      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
      }, 1500);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function setBodyBackground(weatherCondition) {
  const body = document.body;
  let backgroundImageUrl;

  switch (weatherCondition.toLowerCase()) {
    case "clear":
      backgroundImageUrl = "sunnyday.jpg";
      break;
    case "clouds":
      backgroundImageUrl = "cloudy.jpg";
      break;
    case "rain":
      backgroundImageUrl = "rainy.jpg";
      break;
    case "thunderstorm":
      backgroundImageUrl = "storming.jpg";
      break;
    case "snow":
      backgroundImageUrl = "snowy.jpg";
      break;
    case "fog":
    case "smoke":
    case "haze":
    case "mist":
      backgroundImageUrl = "haze.jpg";
      break;
    default:
      backgroundImageUrl = "sunnyday.jpg";
  }

  body.style.backgroundImage = `url(${backgroundImageUrl})`;
  body.style.backgroundSize = "cover";
}

function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${
    data.weather[0].icon
  }@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightSideContent(result) {
  return `<div class="content">
          <p class="title">NAME</p>
          <span class="value">${result.name}</span>
        </div>
        <div class="content">
          <p class="title">TEMP</p>
          <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
        </div>
        <div class="content">
          <p class="title">HUMIDITY</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
          <p class="title">WIND SPEED</p>
          <span class="value">${result.wind.speed} Km/h</span>
        </div>`;
}

async function displayForeCast(lat, long) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();
  const uniqueForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForeCastDays.includes(forecastDate)) {
      return uniqueForeCastDays.push(forecastDate);
    }
  });

  daysForecast.forEach((content, indx) => {
    if (indx <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");

  return `<li>
  <img src="https://openweathermap.org/img/wn/${
    frContent.weather[0].icon
  }@2x.png" />
  <span>${joinDay}</span>
  <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
</li>`;
}
