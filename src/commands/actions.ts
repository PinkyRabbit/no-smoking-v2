import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";

export class Actions {
  constructor(private bot: TelegramBot) {
    this.bot = bot;
  }

  private _res(
    chatId: TelegramBot.ChatId,
    text: string,
    options: TelegramBot.SendMessageOptions = {}
  ) {
    const ops: TelegramBot.SendMessageOptions = { parse_mode: "Markdown", ...options };
    this.bot.sendMessage(chatId, text, ops);
  }

  onMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    this._res(chatId, contentFor(Content.MESSAGE));
  }

  onStart(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    this._res(chatId, contentFor(Content.START_NEW), buttonsFor(DialogKey.beginning));
  }

  toStage1  (chatId: number) {
    this._res(chatId, contentFor(Content.STAGE_1), buttonsFor(DialogKey.stage1));
  };
}