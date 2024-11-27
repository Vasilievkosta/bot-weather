const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { getWeatherEmoji } = require("./weatherEmojis");

const app = express();
const PORT = process.env.PORT || 5000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

app.use(bodyParser.json());

async function makeRequest(url, method = "GET", body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json", ...headers },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error.message);
    throw error;
  }
}

async function getWeather(city) {
  const API_KEY = process.env.API_KEY;
  const baseUrl = "https://api.weatherapi.com/v1/current.json";
  const lang = "ru";
  const url = `${baseUrl}?q=${city}&lang=${lang}&key=${API_KEY}`;

  try {
    const data = await makeRequest(url);
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error.message);
    return null;
  }
}

async function sendMessage(chatId, text) {
  const url = `${TELEGRAM_API}/sendMessage`;
  try {
    await makeRequest(url, "POST", { chat_id: chatId, text });
  } catch (error) {
    console.error("Failed to send message:", error.message);
  }
}

app.post(`/webhook`, async (req, res) => {
  const { message } = req.body;
  const validInputRegex = /^[a-zA-Zа-яА-Я\s-]+$/;

  if (message) {
    const chatId = message.chat.id;
    const city = message.text.trim();

    if (!validInputRegex.test(city)) {
      await sendMessage(chatId, "Введите корректное название города.");
      return res.send();
    }

    const weatherData = await getWeather(city);

    if (weatherData) {
      const { location, current } = weatherData;
      const emoji = getWeatherEmoji(current.condition.code);

      const responseText = `🏙️ ${location.name}, 🚩 ${location.country}\n🌡️ Температура: ${current.temp_c}°C\n ${emoji} ${current.condition.text}\n`;
      await sendMessage(chatId, responseText);
    } else {
      await sendMessage(
        chatId,
        "Не удалось получить данные о погоде. Проверьте название города."
      );
    }
  }
  return res.send();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
