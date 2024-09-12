import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../../content";

export const onMessage = (bot: TelegramBot) => (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, contentFor(Content.START));
};
