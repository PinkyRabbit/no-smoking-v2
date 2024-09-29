import TelegramBot from "node-telegram-bot-api";
import logger from "../logger";
import { UsersRepo } from "../db";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { dateTimeToTime } from "../lib_helpers/luxon";

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
 * Helper to log the event
 * Only to use in smokingTimeTest
 */
const logEvent = (usersCount: number) => {
  const time = dateTimeToTime();
  logger.info(`[${time}] smokingTimeTest call, ${usersCount} affected`);
};

/**
 * Method to notify all users about smoking time
 * @param bot - TelegramBot instance
 */
export const smokingTimeTest = async (bot: TelegramBot) => {
  const chatIds = await UsersRepo.getAllSmokersToSmokeChatIds();
  logEvent(chatIds.length);
  sendDelayed(bot, chatIds);
};