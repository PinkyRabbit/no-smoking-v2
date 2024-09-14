import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../../content";

export const toStage1 = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, contentFor(Content.STAGE_1));
};
