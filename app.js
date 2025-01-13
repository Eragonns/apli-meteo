import { API_KEY, BASE_URL } from "./config.js";

const meteoForm = document.getElementById("meteoForm");
const defaultCity = "Valenciennes";
const cityInput = document.getElementById("city");

window.addEventListener("load", async () => {
  loadWeatherData(defaultCity);
  setInterval(() => {
    loadWeatherData(defaultCity);
  }, 3600000);
});

meteoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    alert("Veuillez saisir une ville");
    return;
  }
  loadWeatherData(city);
});

async function loadWeatherData(city) {
  try {
    const response = await fetch(
      `${BASE_URL}?location=${city}&apikey=${API_KEY}`
    );
    const data = await response.json();
    if (response.ok) {
      const location = data.location.name || "Ville inconnue";
      const hourly = data.timelines.hourly.slice(0, 1);
      let forecastHtml = "";
      hourly.forEach((hour) => {
        const { temperature, weatherCode, humidity } = hour.values;
        const time = new Date(hour.time).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const temp = temperature || "N/A";
        const meteoDescription = mapWeatherCodeToDescription(
          weatherCode || 1000
        );
        forecastHtml += `
        <div class="forecast">
          <p><strong>${time}<strong></p>
          <p>Température: ${temp}°C</p>
          <p>Humidité: ${humidity}%</p>
          <p>Description: ${meteoDescription}</p>
        </div>`;
      });

      document.getElementById("cityName").textContent = location;
      document.getElementById("forecast").innerHTML = forecastHtml;
    } else {
      alert(
        data.message ||
          "Une erreur est survenue lors de la récupération des données"
      );
    }
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de la récupération des données");
  }
}

function mapWeatherCodeToDescription(weatherCode) {
  const meteoDescriptions = {
    1000: "Ciel dégagé",
    1100: "Principalement clair",
    1101: "Partiellement nuageux",
    1102: "Très nuageux",
    2000: "Brouillard",
    2100: "Brouillard léger",
    3000: "Vent faible",
    3001: "Vent modéré",
    3002: "Vent fort",
    4000: "Pluie",
    4001: "Pluie légère",
    4200: "Averses",
    4201: "Averses intenses",
    5000: "Neige",
    5001: "Flocons de neige",
    5100: "Neige légère",
    5101: "Neige forte",
    6000: "Grésil",
    6001: "Grésil léger",
    6200: "Grésil avec averses",
    6201: "Grésil intense",
    7000: "Grêle",
    7101: "Orages intenses",
    7102: "Orages modérés",
  };
  return meteoDescriptions[weatherCode] || "Conditions météo inconnues";
}
