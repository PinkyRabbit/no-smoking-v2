import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { User, UsersRepo } from "../db";
import { Lang, STAGE_1_MAX, STAGE_1_MIN, STAGE_1_STEPS } from "./constants";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { applyLang } from "../lib_helpers/i18n";

export class Actions {
  constructor(private bot: TelegramBot) {
    this.bot = bot;

    // all "on" methods should be bound with "this"
    this.onStart = this.onStart.bind(this);
    this.onLang = this.onLang.bind(this);
    this.onUserUnknown = this.onUserUnknown.bind(this);

    // @FIXME: TO REMOVE!
    this.onMessage = this.onMessage.bind(this);
    this.onDel = this.onDel.bind(this);
  }

  private _res(
    chatId: TelegramBot.ChatId,
    text: string,
    options: TelegramBot.SendMessageOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const ops: TelegramBot.SendMessageOptions = { parse_mode: "Markdown", ...options };
        this.bot.sendMessage(chatId, text, ops).catch((err) => reject(err));
        resolve();
      }, 400);
    });
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

  @transformMsg
  public async onStart(msg: TelegramBot.Message) {
    if (!msg.user) {
      // @TODO: Create a new user logic
      await this._res(msg.chat.id, contentFor(Content.START_NEW), buttonsFor(DialogKey.beginning));
      return;
    }
    if (!msg.user.minDeltaTime) {
      await this._res(msg.chat.id, contentFor(Content.START_EXISTING_STAGE_1));
      await this.toStage1(msg);
      return;
    }
    const min_delta = minsToTimeString(msg.user.minDeltaTime, msg.user.lang);
    const real_delta = minsToTimeString(msg.user.deltaTime || msg.user.minDeltaTime, msg.user.lang);
    const contentProps = { min_delta, real_delta };
    await this._res(msg.chat.id, contentFor(Content.START_EXISTING, contentProps), buttonsFor(DialogKey.start_existing));
  }

  @transformMsg
  @onlyForKnownUsers
  public async onLang(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.LANG), buttonsFor(DialogKey.lang));
  }

  /**
   * This method is called by decorator "onlyForKnownUsers",
   * when non-authorized user trying to make a call to private route
   */
  public async onUserUnknown(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.USER_UNKNOWN), buttonsFor(DialogKey.to_start));
  }

  // @FIXME: TO REMOVE!
  public async onDel(msg: TelegramBot.Message) {
    await UsersRepo.removeUser(msg.chat.id);
    await this._res(msg.chat.id, "Пользователь удалён /del /start");
  }

  @transformMsg
  @onlyForKnownUsers
  public async toStage1(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.im_smoking));
  };

  private async _onNewUserSmoking(msg: TelegramBot.Message) {
    await UsersRepo.addNewUser(msg.chat.id, msg.date);
    const ops = { stage_1_left: `${STAGE_1_STEPS - 1}` };
    await this._res(msg.chat.id, contentFor(Content.FIRST_STEP, ops), buttonsFor(DialogKey.im_smoking));
  }

  private async _stage1(msg: TelegramBot.Message) {
    const update: Partial<User> = { prevTime: msg.date };
    const timeDifferenceSec = msg.date - msg.user.prevTime;
    const deltaTime = Math.round(timeDifferenceSec / 60); // in minutes
    let isValidDeltaTime = true;
    let deltaTimesLeft = STAGE_1_STEPS - msg.user.minDeltaTimesInitial.length;
    if (deltaTime < STAGE_1_MIN) {
      isValidDeltaTime = false;
      const content = contentFor(Content.STAGE_1_IGNORE_MIN, {
        min_stage_1: `${STAGE_1_MIN}`,
        stage_1_left: `${deltaTimesLeft}`,
      });
      await this._res(msg.chat.id, content, buttonsFor(DialogKey.im_smoking));
    }
    if (deltaTime > STAGE_1_MAX) {
      isValidDeltaTime = false;
      const content = contentFor(Content.STAGE_1_IGNORE_MAX, {
        max_stage_1: `${STAGE_1_MAX}`,
        stage_1_left: `${deltaTimesLeft}`,
      });
      await this._res(msg.chat.id, content, buttonsFor(DialogKey.im_smoking));
    }
    if (isValidDeltaTime) {
      deltaTimesLeft -= 1;
      update.minDeltaTimesInitial = msg.user.minDeltaTimesInitial.concat(deltaTime);
    }
    if (isValidDeltaTime && deltaTimesLeft > 0) {
      const content = contentFor(Content.STAGE_1_PROCESSING, {
        stage_1_left: `${deltaTimesLeft}`,
      });
      await this._res(msg.chat.id, content, buttonsFor(DialogKey.im_smoking));
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
        delta_time: minsToTimeString(stage1DeltaAvg, msg.user.lang),
      });
      await this._res(msg.chat.id, content);
      await this._res(msg.chat.id, contentFor(Content.STAGE_2));
    }
    UsersRepo.updateUser(msg.chat.id, update);
  }

  @transformMsg
  @onlyForKnownUsers
  public async imSmokingHandler(msg: TelegramBot.Message) {
    if (!msg.user) {
      return this._onNewUserSmoking(msg);
    }
    if (!msg.user.minDeltaTime) {
      return this._stage1(msg);
    }
    await this._res(msg.chat.id, contentFor(Content.STAGE_2));
    //   const update: Partial<User> = { prevTime: };
    //   const intervals = user.initialPeriods.push(msg.date);
    //

    return;

    const offset = this._getTimezoneOffset(msg);
    console.log(msg);
    console.log(offset);
    this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.im_smoking));
  }

  @transformMsg
  @onlyForKnownUsers
  public async changeLanguageHandler(msg: TelegramBot.Message, lang: Lang) {
    await UsersRepo.updateUser(msg.chat.id, { lang });
    applyLang(lang, msg);
    await this._res(msg.chat.id, contentFor(Content.LANG_APPLIED));
    if (!msg.user.minDeltaTime && !msg.user.minDeltaTimesInitial.length) {
      await this.onStart(msg);
    }
  }

  @transformMsg
  @onlyForKnownUsers
  public async resetIgnoreHandler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg.chat.id, {
      prevTime: 0,
      nextTime: 0,
    });
    const contentProps = { min_delta: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.chat.id, contentFor(Content.START_RESET_IGNORE, contentProps), buttonsFor(DialogKey.im_smoking));
  }

  @transformMsg
  @onlyForKnownUsers
  public async resetToStage1Handler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg.chat.id, {
      prevTime: 0,
      nextTime: 0,
      deltaTime: 0,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
    });
    await this._res(msg.chat.id, contentFor(Content.START_RESET_TO_STAGE_1));
    await this.toStage1(msg);
  }

  @transformMsg
  @onlyForKnownUsers
  public async resetToStage2Handler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg.chat.id, {
      prevTime: 0,
      nextTime: 0,
      deltaTime: msg.user.minDeltaTime,
    });
    const contentProps = { min_delta: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.chat.id, contentFor(Content.START_RESET_TO_STAGE_2, contentProps), buttonsFor(DialogKey.im_smoking));
  }
}