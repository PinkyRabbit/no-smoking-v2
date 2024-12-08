import TelegramBot from "node-telegram-bot-api";
import { Lang } from "../constants";

/**
 * Helper to get cigarettes text based on the user location
 */
export const cigarettesText = (msg: TelegramBot.Message) => {
  const { lang, cigarettesInDay } = msg.user;
  if (lang === Lang.RU && cigarettesInDay === 1) {
    return "1 сигарету";
  }
  if (lang === Lang.RU && cigarettesInDay < 5) {
    return `${cigarettesInDay} сигареты`;
  }
  if (lang === Lang.RU) {
    return `${cigarettesInDay} сигарет`;
  }
  return "cigarettes";
};