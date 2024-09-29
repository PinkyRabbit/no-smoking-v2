import TelegramBot from "node-telegram-bot-api";
import logger from "../logger";
import { smokingTimeTest } from "./smokingTimeTest";

/**
 * Method to start timer for smoking time test
 * @param bot - TelegramBot instance
 */
export const startMinutelySmokingTimeTest = (bot: TelegramBot) => {
  const ONE_MINUTE = 60 * 1000;

  const intervalId = setInterval(() => smokingTimeTest(bot), ONE_MINUTE);

  process.on("SIGINT", () => {
    logger.debug("Received SIGINT. Cleaning up...");
    clearInterval(intervalId);
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    logger.debug("Received SIGTERM. Cleaning up...");
    clearInterval(intervalId);
    process.exit(0);
  });
};