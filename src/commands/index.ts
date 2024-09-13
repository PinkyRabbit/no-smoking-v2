import TelegramBot from "node-telegram-bot-api";
import { BotEvent } from "./keys";
import { onMessage } from "./actions/onMessage";
import { onStart } from "./actions/onStart";

export const botActionsInit = (bot: TelegramBot) => {
  bot.on(BotEvent.Message, onMessage(bot));
  bot.onText(BotEvent.Start, onStart(bot));
};