import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor, ContentProps } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { DevActions } from "./development";
import { User, UsersRepo } from "../db";
import { STAGE_1_MAX, STAGE_1_MIN, STAGE_1_STEPS } from "./constants";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { LogActionCalls, onlyForKnownUsers, transformMsg } from "./decorators";
import { applyLang, tgLangCodeToLang } from "../lib_helpers/i18n";
import { Lang } from "../constants";
import { timestampToTime } from "../lib_helpers/luxon";
import logger from "../logger";

type ResponseOptions = {
  contentProps?: ContentProps;
  buttons?: TelegramBot.SendMessageOptions;
}

@LogActionCalls
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
    contentKey: Content,
    responseOptions: ResponseOptions = {},
  ): Promise<void> {
    const { buttons, contentProps } = responseOptions;
    const text = contentFor(contentKey, contentProps);
    const ops: TelegramBot.SendMessageOptions = { parse_mode: "Markdown" };
    if (buttons) {
      ops.reply_markup = buttons.reply_markup;
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const contentPropsString = Object.entries(contentProps || {})
          .map(([k, v]) => `${k} = "${v}"`)
          .join(", ");
        logger.info(`U-${chatId} -> ${contentKey} ${contentPropsString}`);
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
    await this._res(msg.chat.id, Content.USER_UNKNOWN, { buttons: buttonsFor(DialogKey.to_start) });
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
      await this._res(msg.chat.id, Content.START_NEW, { buttons: buttonsFor(DialogKey.beginning) });
      return;
    }
    if (!msg.user.minDeltaTime) {
      await this._res(msg.chat.id, Content.START_EXISTING_STAGE_1);
      await this.toStage1(msg);
      return;
    }
    const min_delta = minsToTimeString(msg.user.minDeltaTime, msg.user.lang);
    const real_delta = minsToTimeString(msg.user.deltaTime || msg.user.minDeltaTime, msg.user.lang);
    const contentProps = { min_delta, real_delta };
    const buttons = buttonsFor(DialogKey.start_existing);
    await this._res(msg.chat.id, Content.START_EXISTING, { contentProps, buttons });
  }

  /**
   * Start. Step 2
   */
  @transformMsg
  @onlyForKnownUsers
  public async toStage1(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, Content.STAGE_1, { buttons: buttonsFor(DialogKey.im_smoking) });
  };

  /**
   * Language
   */
  @transformMsg
  @onlyForKnownUsers
  public async onLang(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, Content.LANG, { buttons: buttonsFor(DialogKey.lang) });
  }

  @transformMsg
  @onlyForKnownUsers
  public async changeLanguageHandler(msg: TelegramBot.Message, lang: Lang) {
    await UsersRepo.updateUser(msg.chat.id, { lang });
    applyLang(lang, msg);
    await this._res(msg.chat.id, Content.LANG_APPLIED);
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
      const contentProps = { stage_1_left: `${STAGE_1_STEPS - 1}` };
      const buttons = buttonsFor(DialogKey.im_smoking);
      await this._res(msg.chat.id, Content.FIRST_STEP, { contentProps, buttons });
      return;
    }
    const timeDifferenceMs = msg.ts - msg.user.lastTime;
    const deltaTime = Math.round(timeDifferenceMs / 60 / 1000); // in minutes
    logger.debug(`timeDifferenceMs = ${msg.ts} - ${msg.user.lastTime} = ${timeDifferenceMs} (${deltaTime} min)`);
    let isValidDeltaTime = true;
    let deltaTimesLeft = STAGE_1_STEPS - msg.user.minDeltaTimesInitial.length;
    // to ignore if user clicking too often
    if (deltaTime < STAGE_1_MIN) {
      logger.debug(`deltaTime < STAGE_1_MIN, ${deltaTime} < ${STAGE_1_MIN}`);
      isValidDeltaTime = false;
      update.tgLastCallTime = msg.user.tgLastCallTime;
      update.lastTime = msg.user.lastTime;
      const contentProps = { min_stage_1: STAGE_1_MIN, stage_1_left: deltaTimesLeft };
      const buttons = buttonsFor(DialogKey.im_smoking);
      await this._res(msg.chat.id, Content.STAGE_1_IGNORE_MIN, { contentProps, buttons } );
    }
    // to skip calculation if delta is too big
    if (deltaTime > STAGE_1_MAX) {
      logger.debug(`deltaTime > STAGE_1_MAX ${deltaTime} > ${STAGE_1_MAX}`);
      isValidDeltaTime = false;
      const contentProps = { max_stage_1: STAGE_1_MAX, stage_1_left: deltaTimesLeft  };
      const buttons = buttonsFor(DialogKey.im_smoking);
      await this._res(msg.chat.id, Content.STAGE_1_IGNORE_MAX, { contentProps, buttons });
    }
    // add time if timestamp is valid
    if (isValidDeltaTime) {
      deltaTimesLeft -= 1;
      update.minDeltaTimesInitial = msg.user.minDeltaTimesInitial.concat(deltaTime);
    }
    if (isValidDeltaTime && deltaTimesLeft > 0) {
      const contentProps = { stage_1_left: deltaTimesLeft };
      const buttons = buttonsFor(DialogKey.im_smoking);
      await this._res(msg.chat.id, Content.STAGE_1_PROCESSING, { contentProps, buttons } );
    }
    if (isValidDeltaTime && deltaTimesLeft < 1) {
      const summaryStage1Delta = update.minDeltaTimesInitial!.reduce((a, b) => a + b, 0);
      const stage1DeltaCount = update.minDeltaTimesInitial!.length;
      const stage1DeltaAvg = Math.round(summaryStage1Delta / stage1DeltaCount);
      update.minDeltaTimesInitial = [];
      update.minDeltaTime = stage1DeltaAvg;
      update.deltaTime = stage1DeltaAvg;
      update.nextTime = msg.ts + (stage1DeltaAvg * 60 * 1000);
      const contentProps = { delta_time: minsToTimeString(stage1DeltaAvg, msg.user.lang) };
      await this._res(msg.chat.id, Content.STAGE_1_END, { contentProps });
      const time_to_get_smoke = timestampToTime(msg.date + (stage1DeltaAvg * 60));
      const stage2Response: ResponseOptions = {
        contentProps: { time_to_get_smoke },
        buttons: buttonsFor(DialogKey.im_smoking),
      };
      await this._res(msg.chat.id, Content.STAGE_2, stage2Response);
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
      const contentProps = { penalty };
      await this._res(msg.chat.id, Content.PENALTY, { contentProps });
    }
    await UsersRepo.updateUser(msg.chat.id, update);
    const time_to_get_smoke = timestampToTime(msg.date + (msg.user.deltaTime * 60));
    const stage2Response: ResponseOptions = {
      contentProps: { time_to_get_smoke },
      buttons: buttonsFor(DialogKey.im_smoking),
    };
    await this._res(msg.chat.id, Content.STAGE_2, stage2Response);
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
    const buttons = buttonsFor(DialogKey.im_smoking);
    await this._res(msg.chat.id, Content.START_RESET_IGNORE, { contentProps, buttons });
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
    await this._res(msg.chat.id, Content.START_RESET_TO_STAGE_1);
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
    const buttons = buttonsFor(DialogKey.im_smoking);
    await this._res(msg.chat.id, Content.START_RESET_TO_STAGE_2, { contentProps, buttons });
  }
}