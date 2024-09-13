import TelegramBot from "node-telegram-bot-api";
import { BotEvent } from "./keys";
import { onMessage } from "./actions/onMessage";
import { onStart } from "./actions/onStart";

export const botActionsInit = (bot: TelegramBot) => {
  bot.onText(BotEvent.Start, onStart(bot));
  bot.on(BotEvent.Message, onMessage(bot));
  bot.on(BotEvent.Callback, (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    // Handle the button click based on the callback data
    switch (data) {
      case 'btn1':
        bot.sendMessage(chatId, 'You clicked Button 1');
        break;
      case 'btn2':
        bot.sendMessage(chatId, 'You clicked Button 2');
        break;
      case 'btn3':
        bot.sendMessage(chatId, 'You clicked Button 3');
        break;
      // Add more cases for additional buttons
    }
  });
};