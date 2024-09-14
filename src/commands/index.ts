import TelegramBot  from "node-telegram-bot-api";
import { BotEvent } from "./keys";
import { Callback } from "../buttons/keys";
import * as act from "./actions";

export const botActionsInit = (bot: TelegramBot) => {
  bot.onText(BotEvent.Start, act.onStart(bot));
  bot.on(BotEvent.Message, act.onMessage(bot));

  bot.on(BotEvent.Callback, (callbackQuery: TelegramBot.CallbackQuery) => {
    const chatId = callbackQuery.message?.chat.id;
    const callbackType = callbackQuery.data as Callback;
    if (!chatId || !callbackType) {
      return;
    }
    switch (callbackType) {
      case Callback.beginning:
        act.toStage1(bot, chatId);
        break;
      default:
        console.log(`Unsupported callback "${callbackType}"`);
    }
  });
};