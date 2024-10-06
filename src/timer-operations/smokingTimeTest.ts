import TelegramBot from "node-telegram-bot-api";
import { UsersRepo } from "../db";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";

/**
 * Helper to make messages to send delayed
 * Only to use in smokingTimeTest
 */
const sendDelayed = (bot: TelegramBot, chatIds: number[]) => {
  const chatId = chatIds.pop();
  if (!chatId) {
    return;
  }
  bot.sendMessage(chatId, contentFor(Content.TIME_FOR_A_SMOKE), buttonsFor(DialogKey.im_smoking));
  setTimeout(() => sendDelayed(bot, chatIds.slice(1)), 10);
};

/**
 * Method to notify all users about smoking time
 * @param bot - TelegramBot instance
 */
export const smokingTimeTest = async (bot: TelegramBot) => {
  const chatIds = await UsersRepo.getAllSmokersToSmokeChatIds();
  sendDelayed(bot, chatIds);
};