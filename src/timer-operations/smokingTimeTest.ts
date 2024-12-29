import TgBot from "../telegram-bot";
import { User, UsersRepo } from "../db";
import { Content, DialogKey } from "../constants";

/**
 * Helper to make messages to send delayed
 * Only to use in smokingTimeTest
 * @private
 */
export const _sendDelayedToSmokers = (bot: TgBot, users: User[]) => {
  const user = users.pop();
  if (!user) {
    return;
  }
  bot.sendToUser(user, Content.TIME_FOR_A_SMOKE);
  setTimeout(() => _sendDelayedToSmokers(bot, users), 10);
};

/**
 * Helper to make messages to send delayed
 * Only to use in smokingTimeTest
 * @private
 */
export const _sendDelayedToIgnore = (bot: TgBot, users: User[]) => {
  const user = users.pop();
  if (!user) {
    return;
  }
  bot.sendToUser(user, Content.BOT_IGNORE, {}, DialogKey.ignore);
  setTimeout(() => _sendDelayedToIgnore(bot, users), 10);
};

/**
 * Method to notify all users about smoking time
 * @param bot - TelegramBot instance
 */
export const smokingTimeTest = async (bot: TgBot) => {
  const usersToSmoke = await UsersRepo.getAllSmokersToSmoke();
  _sendDelayedToSmokers(bot, usersToSmoke);
  const usersIgnoringBot = await UsersRepo.getAllIgnoringBot();
  _sendDelayedToIgnore(bot, usersIgnoringBot);
};