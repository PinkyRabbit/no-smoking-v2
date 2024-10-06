import TgBot from "../telegram-bot";
import { User, UsersRepo } from "../db";
import { Content, DialogKey } from "../constants";

/**
 * Helper to make messages to send delayed
 * Only to use in smokingTimeTest
 */
const sendDelayed = (bot: TgBot, users: User[]) => {
  const user = users.pop();
  if (!user) {
    return;
  }
  bot.sendToUser(user, Content.TIME_FOR_A_SMOKE, {}, DialogKey.im_smoking);
  setTimeout(() => sendDelayed(bot, users.slice(1)), 10);
};

/**
 * Method to notify all users about smoking time
 * @param bot - TelegramBot instance
 */
export const smokingTimeTest = async (bot: TgBot) => {
  const users = await UsersRepo.getAllSmokersToSmoke();
  sendDelayed(bot, users);
};