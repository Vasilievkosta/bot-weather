const weatherEmojis = {
  1000: "☀️", // Clear/Sunny
  1003: "⛅", // Partly Cloudy
  1006: "☁️", // Cloudy
  1009: "🌫️", // Overcast
  1030: "🌫️", // Mist
  1063: "🌧️", // Patchy rain possible
  1066: "🌨️", // Patchy snow possible
  1087: "⛈️", // Thunderstorm
  1117: "🌬️", // Blizzard
  1135: "🌫️", // Fog
  1150: "🌦️", // Light drizzle
  1183: "🌧️", // Light rain
  1210: "🌨️", // Light snow
  1240: "🌦️", // Light rain showers
  1273: "⛈️", // Patchy light rain with thunder
};

function getWeatherEmoji(code) {
  return weatherEmojis[code] || " ☁️ ";
}

module.exports = { getWeatherEmoji };
