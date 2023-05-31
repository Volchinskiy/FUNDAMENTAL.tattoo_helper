import express from "express";
import { webhookCallback } from "grammy";
import { TelegramManager } from './telegram_bot_manager.class.js';

if (process.env.IS_PRODUCTION === "true") {
  const server = express();
  server.use(express.json());
  server.use(webhookCallback(telegramBotManager.BOT, "express"));

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(` BOT STARTED ON ${PORT} PORT `));
} else {
  telegramBotManager.BOT.start();
  console.log(` BOT STARTED `)
}

// import express from "express";
// import TelegramManager from "./telegramManager/telegramManager.js";

// const app = express();
// const PORT = process.env.PORT || 8080;

// app.listen(PORT, () => {
//   TelegramManager.botStarted();
//   console.log("Server has been started ...");
// });
