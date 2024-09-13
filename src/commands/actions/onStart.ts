import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../../content";
import { buttonsFor, DialogKey } from "../../buttons";

export const onStart = (bot: TelegramBot) => (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, contentFor(Content.START_NEW), buttonsFor(DialogKey.beginning));
};
