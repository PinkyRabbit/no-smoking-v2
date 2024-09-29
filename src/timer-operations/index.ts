import TelegramBot from "node-telegram-bot-api";
import { smokingTimeTest } from "./smokingTimeTest";

/**
 * Method to start timer for smoking time test
 * @param bot - TelegramBot instance
 */
export const startMinutelySmokingTimeTest = (bot: TelegramBot) => {
  const ONE_MINUTE = 60 * 1000;

  const intervalId = setInterval(() => smokingTimeTest(bot), ONE_MINUTE);

  process.on("SIGINT", () => {
    console.log("Received SIGINT. Cleaning up...");
    clearInterval(intervalId);
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Cleaning up...");
    clearInterval(intervalId);
    process.exit(0);
  });
};