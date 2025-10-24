import TgBot from "../telegram-bot";
import { User, UsersRepo } from "../db";
import { Content, DialogKey } from "../constants";
import { getIdleVariants } from "../helpers/idle";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { computeNewDelta } from "../helpers";
import { isDayToSendChatLinkCheck } from "../lib_helpers/luxon";

/**
 * Helper to make messages to send delayed
 * Only to use in smokingTimeTest
 * @private
 */
export const _sendDelayedToSmokers = (bot: TgBot, users: User[], isDayOfChatLinkSending?: boolean) => {
  const user = users.pop();
  if (!user) {
    return;
  }
  if (isDayOfChatLinkSending && user.cigarettesInDay === 5) {
    bot.sendToUser(user, Content.JOIN_OUR_CHAT);
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
  const buttonsForIdle = getIdleVariants(user.lang);
  const no_penalty_time = minsToTimeString(user.deltaTime, user.lang);
  const tenMinutesDelta = computeNewDelta(user, true);
  const penalty_10_time= minsToTimeString(tenMinutesDelta, user.lang);
  bot.sendToUser(user, Content.BOT_IGNORE, { ...buttonsForIdle, no_penalty_time, penalty_10_time }, DialogKey.ignore);
  setTimeout(() => _sendDelayedToIgnore(bot, users), 10);
};

/**
 * Method to notify all users about smoking time
 * @param bot - TelegramBot instance
 */
export const smokingTimeTest = async (bot: TgBot) => {
  const usersToSmoke = await UsersRepo.getAllSmokersToSmoke();
  const isDayOfChatLinkSending = isDayToSendChatLinkCheck();
  _sendDelayedToSmokers(bot, usersToSmoke, isDayOfChatLinkSending);
  const usersIgnoringBot = await UsersRepo.getAllIgnoringBot();
  _sendDelayedToIgnore(bot, usersIgnoringBot);
};