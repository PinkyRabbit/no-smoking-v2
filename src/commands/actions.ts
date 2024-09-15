import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { UsersRepo } from "../db";

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

  private async _getTimezoneOffset(msg: TelegramBot.Message) {
    const messageDate = new Date(msg.date * 1000);
    return messageDate.getTimezoneOffset();
  }

  onMessage(msg: TelegramBot.Message) {
    console.log("!!!!");
    this._res( msg.chat.id, contentFor(Content.MESSAGE));
  }

  onStart(msg: TelegramBot.Message) {
    this._res(msg.chat.id, contentFor(Content.START_NEW), buttonsFor(DialogKey.beginning));
  }

  toStage1  (msg: TelegramBot.Message) {
    this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.stage1));
  };

  async imSmokingHandler(msg: TelegramBot.Message) {
    const user = await UsersRepo.getByChatId(msg.chat.id);
    if (!user) {
      await UsersRepo.addNewUser(msg.chat.id, msg.date);
      this._res(msg.chat.id, contentFor(Content.FIRST_STEP), buttonsFor(DialogKey.stage1));
      return;
    }
    if (user.isStage1) {
      this._res(msg.chat.id, contentFor(Content.FIRST_STEP), buttonsFor(DialogKey.stage1));
    }
    //   const update: Partial<User> = { prevTime: };
    //   const intervals = user.initialPeriods.push(msg.date);
    //

    console.log("----- user");
    console.log(user);
    return;

    const offset = this._getTimezoneOffset(msg);
    console.log(msg);
    console.log(offset);
    this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.stage1));
  }
}