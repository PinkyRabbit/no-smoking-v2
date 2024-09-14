import TelegramBot from "node-telegram-bot-api";
import { initDatabase } from "./db";
import { botActionsInit } from "./commands";

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN environment variable is not set");
}

initDatabase()
  .then(() => {
    console.log("Connected to database");
    const bot = new TelegramBot(token, { polling: true });
    botActionsInit(bot);
  })
  .catch((err: { message: string }) => {
    console.error("Error connecting to database:", err);
    process.exit(1);
  });