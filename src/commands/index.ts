import TelegramBot from "node-telegram-bot-api";
import { BotEvent } from "./keys";
import { onMessage} from "./actions/onMessage";

export const botActionsInit = (bot: TelegramBot) => {
  bot.on(BotEvent.MESSAGE, onMessage(bot));
};