import * as dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

dotenv.config();

const IAM_TOKEN = process.env.IAM_TOKEN;
let headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${IAM_TOKEN}`,
};
const getTranslation = async (str, lang) => {
  const body = {
    folderId: "b1gk2ptqfaffpvp3h384",
    targetLanguageCode: lang,
    texts: str,
  };
  try {
    const response = await fetch(
      "https://translate.api.cloud.yandex.net/translate/v2/translate",
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    const translation = await response.json();
    return translation.translations[0].text;
  } catch (e) {
    console.log(e);
  }
};
const token = process.env.TELEGRAM_API_TOKEN;
const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  if (msg.text) {
    const chatId = msg.chat.id;
    const enText = await getTranslation(msg.text, "en");
    const res = await api.sendMessage(enText);
    const ruText = await getTranslation(res.text, "ru");
    bot.sendMessage(chatId, ruText);
  } else {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Я могу ответить только на текст");
  }
});
