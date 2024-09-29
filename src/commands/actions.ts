import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { DevActions } from "./development";
import { User, UsersRepo } from "../db";
import { STAGE_1_MAX, STAGE_1_MIN, STAGE_1_STEPS } from "./constants";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { applyLang, tgLangCodeToLang } from "../lib_helpers/i18n";
import { Lang } from "../constants";
import { timestampToTime } from "../lib_helpers/luxon";

export class Actions extends DevActions {
  constructor(private bot: TelegramBot) {
    super();
    this.bot = bot;
    // all "on" methods should be bound with "this"
    this.onStart = this.onStart.bind(this);
    this.onLang = this.onLang.bind(this);
    this.onUserUnknown = this.onUserUnknown.bind(this);
  }

  protected override _res(
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

  /**
   * This method is called by decorator "onlyForKnownUsers",
   * when non-authorized user trying to make a call to private route
   */
  public async onUserUnknown(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.USER_UNKNOWN), buttonsFor(DialogKey.to_start));
  }

  /**
   * Start. Step 1
   */
  @transformMsg
  public async onStart(msg: TelegramBot.Message) {
    if (!msg.user) {
      const lang = tgLangCodeToLang(msg.from!.language_code);
      const user = await UsersRepo.addNewUser(msg.chat.id, lang);
      applyLang(user.lang, msg);
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

  /**
   * Start. Step 2
   */
  @transformMsg
  @onlyForKnownUsers
  public async toStage1(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.STAGE_1), buttonsFor(DialogKey.im_smoking));
  };

  /**
   * Language
   */
  @transformMsg
  @onlyForKnownUsers
  public async onLang(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.LANG), buttonsFor(DialogKey.lang));
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

  /**
   * Stage 1
   */
  private async _stage1(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      tgLastCallTime: msg.date,
      lastTime: msg.ts,
    };
    if (!msg.user.tgLastCallTime) {
      update.minDeltaTimesInitial = [msg.ts];
      await UsersRepo.updateUser(msg.chat.id, update);
      const ops = { stage_1_left: `${STAGE_1_STEPS - 1}` };
      await this._res(msg.chat.id, contentFor(Content.FIRST_STEP, ops), buttonsFor(DialogKey.im_smoking));
      return;
    }
    const timeDifferenceSec = msg.ts - msg.user.lastTime;
    const deltaTime = Math.round(timeDifferenceSec / 60 / 1000); // in minutes
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
      update.nextTime = msg.ts + (stage1DeltaAvg * 60 * 1000);
      const content = contentFor(Content.STAGE_1_END, {
        delta_time: minsToTimeString(stage1DeltaAvg, msg.user.lang),
      });
      await this._res(msg.chat.id, content);
      const time_to_get_smoke = timestampToTime(msg.date + (stage1DeltaAvg * 60));
      await this._res(msg.chat.id, contentFor(Content.STAGE_2, { time_to_get_smoke }), buttonsFor(DialogKey.im_smoking));
    }
    UsersRepo.updateUser(msg.chat.id, update);
  }

  @transformMsg
  @onlyForKnownUsers
  public async imSmokingHandler(msg: TelegramBot.Message) {
    if (!msg.user.minDeltaTime) {
      return this._stage1(msg);
    }
    const update: Partial<User> = {
      tgLastCallTime: msg.date,
      lastTime: msg.ts,
      nextTime: msg.ts + (msg.user.deltaTime * 60 * 1000),
    };
    if (msg.ts < msg.user.nextTime) {
      const penalty = msg.user.penalty + 1;
      update.penalty = penalty;
      await this._res(msg.chat.id, contentFor(Content.PENALTY, { penalty: `${penalty}` }));
    }
    await UsersRepo.updateUser(msg.chat.id, update);
    const time_to_get_smoke = timestampToTime(msg.date + (msg.user.deltaTime * 60));
    await this._res(msg.chat.id, contentFor(Content.STAGE_2, { time_to_get_smoke }), buttonsFor(DialogKey.im_smoking));
  }

  /**
   * Existing user /start callbacks
   */
  @transformMsg
  @onlyForKnownUsers
  public async resetIgnoreHandler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg.chat.id, {
      tgLastCallTime: 0,
      lastTime: 0,
      nextTime: 0,
    });
    const contentProps = { min_delta: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.chat.id, contentFor(Content.START_RESET_IGNORE, contentProps), buttonsFor(DialogKey.im_smoking));
  }

  @transformMsg
  @onlyForKnownUsers
  public async resetToStage1Handler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg.chat.id, {
      tgLastCallTime: 0,
      lastTime: 0,
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
      tgLastCallTime: 0,
      lastTime: 0,
      nextTime: 0,
      deltaTime: msg.user.minDeltaTime,
    });
    const contentProps = { min_delta: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.chat.id, contentFor(Content.START_RESET_TO_STAGE_2, contentProps), buttonsFor(DialogKey.im_smoking));
  }
}