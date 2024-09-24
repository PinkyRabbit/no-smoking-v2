import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { User, UsersRepo } from "../db";
import { STAGE_1_MAX, STAGE_1_MIN, STAGE_1_STEPS } from "./constants";
import { minsToTimeString } from "../lib_helpers/humanize-duration";

export class Actions {
  constructor(private bot: TelegramBot) {
    this.bot = bot;

    // all "on" methods should be bound with "this"
    this.onMessage = this.onMessage.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onLang = this.onLang.bind(this);
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
    if (typeof msg.text !== "string") {
      return;
    }
    const stage1 = "st1 ";
    if (msg.text.indexOf(stage1) === 0) {
      const value = Number.parseInt(msg.text.replace(stage1, ""), 10);
      const update: Partial<User> = {
        prevTime: msg.date - 60 * 60,
        minDeltaTimesInitial: new Array(20).fill(value),
      };
      UsersRepo.updateUser(msg.chat.id, update);
      this.bot.sendMessage(msg.chat.id,`Значение ${value} установлено`);
      return;
    }
    if (msg.text === "tost1") {
      const update: Partial<User> = {
        prevTime: msg.date - 60 * 60,
        minDeltaTime: 0,
        minDeltaTimesInitial: [],
      };
      UsersRepo.updateUser(msg.chat.id, update);
      this.bot.sendMessage(msg.chat.id,"Пользователь сброшен до stage 1");
      return;
    }
  }

  onStart(msg: TelegramBot.Message) {
    this._res(msg.chat.id, contentFor(Content.START_NEW), buttonsFor(DialogKey.beginning));
  }

  onLang(msg: TelegramBot.Message) {
    this._res(msg.chat.id, contentFor(Content.LANG), buttonsFor(DialogKey.lang));
  }

  toStage1(msg: TelegramBot.Message) {
    this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.stage1));
  };

  private async _onNewUserSmoking(msg: TelegramBot.Message) {
    await UsersRepo.addNewUser(msg.chat.id, msg.date);
    const ops = { stage_1_left: `${STAGE_1_STEPS - 1}` };
    this._res(msg.chat.id, contentFor(Content.FIRST_STEP, ops), buttonsFor(DialogKey.stage1));
  }

  private async _stage1(msg: TelegramBot.Message, user: User) {
    const update: Partial<User> = { prevTime: msg.date };
    const timeDifferenceSec = msg.date - user.prevTime;
    const deltaTime = Math.round(timeDifferenceSec / 60); // in minutes
    let isValidDeltaTime = true;
    let deltaTimesLeft = STAGE_1_STEPS - user.minDeltaTimesInitial.length;
    if (deltaTime < STAGE_1_MIN) {
      isValidDeltaTime = false;
      const content = contentFor(Content.STAGE_1_IGNORE_MIN, {
        min_stage_1: `${STAGE_1_MIN}`,
        stage_1_left: `${deltaTimesLeft}`,
      });
      this._res(msg.chat.id, content, buttonsFor(DialogKey.stage1));
    }
    if (deltaTime > STAGE_1_MAX) {
      isValidDeltaTime = false;
      const content = contentFor(Content.STAGE_1_IGNORE_MAX, {
        max_stage_1: `${STAGE_1_MAX}`,
        stage_1_left: `${deltaTimesLeft}`,
      });
      this._res(msg.chat.id, content, buttonsFor(DialogKey.stage1));
    }
    if (isValidDeltaTime) {
      deltaTimesLeft -= 1;
      update.minDeltaTimesInitial = user.minDeltaTimesInitial.concat(deltaTime);
    }
    if (isValidDeltaTime && deltaTimesLeft > 0) {
      const content = contentFor(Content.STAGE_1_PROCESSING, {
        stage_1_left: `${deltaTimesLeft}`,
      });
      this._res(msg.chat.id, content, buttonsFor(DialogKey.stage1));
    }
    if (isValidDeltaTime && deltaTimesLeft < 1) {
      const summaryStage1Delta = update.minDeltaTimesInitial!.reduce((a, b) => a + b, 0);
      const stage1DeltaCount = update.minDeltaTimesInitial!.length;
      const stage1DeltaAvg = Math.round(summaryStage1Delta / stage1DeltaCount);
      update.minDeltaTimesInitial = [];
      update.minDeltaTime = stage1DeltaAvg;
      update.deltaTime = stage1DeltaAvg;
      update.prevTime = msg.date;
      update.nextTime = msg.date + (stage1DeltaAvg * 60);
      const content = contentFor(Content.STAGE_1_END, {
        delta_time: minsToTimeString(stage1DeltaAvg),
      });
      this._res(msg.chat.id, content);
      setTimeout(() => {
        this._res(msg.chat.id, contentFor(Content.STAGE_2));
      }, 5000);
    }
    UsersRepo.updateUser(msg.chat.id, update);
  }

  async imSmokingHandler(msg: TelegramBot.Message) {
    const user = await UsersRepo.getByChatId(msg.chat.id);
    if (!user) {
      return this._onNewUserSmoking(msg);
    }
    if (!user.minDeltaTime) {
      return this._stage1(msg, user);
    }
    this._res(msg.chat.id, contentFor(Content.STAGE_2));
    //   const update: Partial<User> = { prevTime: };
    //   const intervals = user.initialPeriods.push(msg.date);
    //

    return;

    const offset = this._getTimezoneOffset(msg);
    console.log(msg);
    console.log(offset);
    this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.stage1));
  }
}