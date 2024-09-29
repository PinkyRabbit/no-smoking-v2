import TelegramBot from "node-telegram-bot-api";
import logger from "./logger";
import { initDatabase } from "./db";
import { botActionsInit } from "./commands";
import { startMinutelySmokingTimeTest } from "./timer-operations";

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  process.exit(1);
});

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN environment variable is not set");
}

initDatabase()
  .then(() => {
    logger.info("Connected to database");
    const bot = new TelegramBot(token, { polling: true });
    botActionsInit(bot);
    startMinutelySmokingTimeTest(bot);
  })
  .catch((err: { message: string }) => {
    logger.error("Error connecting to database:", err);
    process.exit(1);
  });