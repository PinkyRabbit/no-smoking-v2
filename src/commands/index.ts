import TelegramBot  from "node-telegram-bot-api";
import { BotEvent } from "./keys";
import { Callback } from "../buttons/keys";
import { Actions } from "./actions";

export const botActionsInit = (bot: TelegramBot) => {
  const act = new Actions(bot);
  bot.onText(BotEvent.Start, act.onStart);
  bot.on(BotEvent.Message, act.onMessage);
  bot.on(BotEvent.Callback, (callbackQuery: TelegramBot.CallbackQuery) => {
    const callbackType = callbackQuery.data as Callback;
    const message = callbackQuery.message;
    if (!message || !callbackType) {
      return;
    }
    switch (callbackType) {
      case Callback.beginning:
        act.toStage1(message);
        break;
      case Callback.im_smoking:
        act.imSmokingHandler(message);
        break;
      default:
        console.log(`Unsupported callback "${callbackType}"`);
    }
  });
};