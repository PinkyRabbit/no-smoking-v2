import TelegramBot from "node-telegram-bot-api";
import TgBot from "../telegram-bot";
import { ContentProps, getContent } from "../content";
import { Content, DialogKey, Lang } from "../constants";
import { DevActions } from "./development";
import { User, UsersRepo } from "../db";
import { MIN_INTERVAL, STAGE_1_MAX, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { LogActionCalls, onlyForKnownUsers, transformMsg } from "./decorators";
import { tgLangCodeToLang } from "../lib_helpers/i18n";
import { timestampToTime, tsToDateTime } from "../lib_helpers/luxon";
import logger from "../logger";
import { getButtons } from "../buttons";

@LogActionCalls
export class Actions extends DevActions {
  constructor(private bot: TgBot) {
    super();
    this.bot = bot;
    // all "on" methods should be bound with "this"
    this.onStart = this.onStart.bind(this);
    this.onLang = this.onLang.bind(this);
    this.onUserUnknown = this.onUserUnknown.bind(this);
  }

  protected override _res(
    user: User,
    contentKey: Content,
    contentProps: ContentProps = {},
    dialogKey?: DialogKey,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const contentPropsString = Object.entries(contentProps || {})
          .map(([k, v]) => `${k} = "${v}"`)
          .join(", ");
        logger.info(`U-${user.chatId} -> ${contentKey} ${contentPropsString}`);
        this.bot.sendToUser(user, contentKey, contentProps, dialogKey).catch((err) => reject(err));
        resolve();
      }, 400);
    });
  }

  /**
   * This method is called by decorator "onlyForKnownUsers",
   * when non-authorized user trying to make a call to private route
   */
  public async onUserUnknown(msg: TelegramBot.Message) {
    const fakeUser = { chatId: msg.chat.id, lang: tgLangCodeToLang(msg.from!.language_code) } as User;
    await this._res(fakeUser, Content.USER_UNKNOWN, {}, DialogKey.to_start);
  }

  /**
   * Start. Step 1
   */
  @transformMsg
  public async onStart(msg: TelegramBot.Message) {
    if (!msg.user) {
      const lang = tgLangCodeToLang(msg.from!.language_code);
      const user = await UsersRepo.addNewUser(msg.chat.id, lang);
      await this._res(user, Content.START_NEW, {}, DialogKey.beginning);
      return;
    }
    if (!msg.user.minDeltaTime) {
      await this._res(msg.user, Content.START_EXISTING_STAGE_1);
      await this.toStage1(msg);
      return;
    }
    const min_delta = minsToTimeString(msg.user.minDeltaTime, msg.user.lang);
    const real_delta = minsToTimeString(msg.user.deltaTime || msg.user.minDeltaTime, msg.user.lang);
    await this._res(msg.user, Content.START_EXISTING, { min_delta, real_delta }, DialogKey.start_existing);
  }

  /**
   * Start. Step 2
   */
  @transformMsg
  @onlyForKnownUsers
  public async toStage1(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.STAGE_1, {}, DialogKey.im_smoking);
  };

  /**
   * Language
   */
  @transformMsg
  @onlyForKnownUsers
  public async onLang(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.LANG, {}, DialogKey.lang);
  }

  @transformMsg
  @onlyForKnownUsers
  public async changeLanguageHandler(msg: TelegramBot.Message, lang: Lang) {
    await UsersRepo.updateUser(msg.chat.id, { lang });
    msg.user.lang = lang;
    await this._res(msg.user, Content.LANG_APPLIED);
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
      await this._res(msg.user, Content.FIRST_STEP, { stage_1_left: STAGE_1_STEPS - 1 }, DialogKey.im_smoking);
      return;
    }
    const timeDifferenceMs = msg.ts - msg.user.lastTime;
    const deltaTime = Math.round(timeDifferenceMs / 60 / 1000); // in minutes
    logger.debug(`timeDifferenceMs = ${msg.ts} - ${msg.user.lastTime} = ${timeDifferenceMs} (${deltaTime} min)`);
    let isValidDeltaTime = true;
    let deltaTimesLeft = STAGE_1_STEPS - msg.user.minDeltaTimesInitial.length;
    // to ignore if user clicking too often
    if (deltaTime < MIN_INTERVAL) {
      logger.debug(`deltaTime < MIN_INTERVAL, ${deltaTime} < ${MIN_INTERVAL}`);
      isValidDeltaTime = false;
      update.tgLastCallTime = msg.user.tgLastCallTime;
      update.lastTime = msg.user.lastTime;
      const contentProps = { min_stage_1: minsToTimeString(MIN_INTERVAL), stage_1_left: deltaTimesLeft };
      await this._res(msg.user, Content.STAGE_1_IGNORE_MIN, contentProps, DialogKey.im_smoking);
    }
    // to skip calculation if delta is too big
    if (deltaTime > STAGE_1_MAX) {
      logger.debug(`deltaTime > STAGE_1_MAX ${deltaTime} > ${STAGE_1_MAX}`);
      isValidDeltaTime = false;
      const contentProps = { max_stage_1: STAGE_1_MAX, stage_1_left: deltaTimesLeft  };
      await this._res(msg.user, Content.STAGE_1_IGNORE_MAX, contentProps, DialogKey.im_smoking);
    }
    // add time if timestamp is valid
    if (isValidDeltaTime) {
      deltaTimesLeft -= 1;
      update.minDeltaTimesInitial = msg.user.minDeltaTimesInitial.concat(deltaTime);
    }
    if (isValidDeltaTime && deltaTimesLeft > 0) {
      await this._res(msg.user, Content.STAGE_1_PROCESSING, { stage_1_left: deltaTimesLeft }, DialogKey.im_smoking);
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
      await this._res(msg.user, Content.STAGE_1_END, contentProps);
      const time_to_get_smoke = timestampToTime(msg.date + (stage1DeltaAvg * 60));
      await this._res(msg.user, Content.STAGE_2_INITIAL,  { time_to_get_smoke }, DialogKey.im_smoking);
    }
    UsersRepo.updateUser(msg.chat.id, update);
  }

  @transformMsg
  @onlyForKnownUsers
  public async imSmokingHandler(msg: TelegramBot.Message) {
    if (!msg.user.minDeltaTime) {
      return this._stage1(msg);
    }
    /**
     * Stage 2
     */
    const timeDifferenceMs = msg.ts - msg.user.lastTime;
    const currentDelta = Math.round(timeDifferenceMs / 60 / 1000); // in minutes
    logger.debug(`timeDifferenceMs = ${msg.ts} - ${msg.user.lastTime} = ${timeDifferenceMs} (${currentDelta} min)`);
    // ignore spam
    if (currentDelta < MIN_INTERVAL) {
      await this._res(msg.user, Content.STAGE_2_IGNORE_MIN, { min_interval: minsToTimeString(MIN_INTERVAL) });
      return;
    }
    const update: Partial<User> = {
      tgLastCallTime: msg.date,
      lastTime: msg.ts,
      nextTime: msg.ts + (msg.user.deltaTime * 60 * 1000),
    };
    // penalty
    if (msg.ts < msg.user.nextTime) {
      logger.debug(`U-${msg.user.chatId} [penalty] ${tsToDateTime(msg.ts)} < ${tsToDateTime(msg.user.nextTime)}`);
      const penalty = msg.user.penalty + 1;
      update.penalty = penalty;
      await this._res(msg.user, Content.PENALTY, { penalty });
    }
    // idle
    if (currentDelta >= USER_IDLE_TIME) {
      logger.debug(`U-${msg.user.chatId} [idle] ${currentDelta} >= ${USER_IDLE_TIME}`);
      const DIFFICULTY_LEVEL = 1;
      const newDelta = msg.user.deltaTime + DIFFICULTY_LEVEL - msg.user.penalty;
      const newNextTime = msg.ts + (newDelta * 60 * 1000);
      update.penalty = 0;
      update.deltaTime = newDelta;
      update.nextTime = newNextTime;
      const content: string[] = [];
      content.push(getContent(msg.user.lang, Content.ON_IDLE_START));
      content.push(getContent(msg.user.lang, Content.ON_IDLE_END, {
        prev_delta: minsToTimeString(msg.user.deltaTime, msg.user.lang),
        new_delta: minsToTimeString(newDelta, msg.user.lang),
        time_to_get_smoke: timestampToTime(msg.date + (newDelta * 60)),
        penalty: minsToTimeString(msg.user.penalty, msg.user.lang),
        step: minsToTimeString(DIFFICULTY_LEVEL, msg.user.lang),
      }));
      const { reply_markup } = getButtons(msg.user.lang, DialogKey.im_smoking);
      const ops: TelegramBot.SendMessageOptions = { parse_mode: "Markdown", reply_markup };
      await this.bot.sendMessage(msg.user.chatId, content.join(""), ops);
    }
    // normal stage 2
    if (currentDelta < USER_IDLE_TIME) {
      const time_to_get_smoke = timestampToTime(msg.date + (msg.user.deltaTime * 60));
      await this._res(msg.user, Content.STAGE_2, { time_to_get_smoke }, DialogKey.im_smoking);
    }
    // update user
    await UsersRepo.updateUser(msg.chat.id, update);
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
    await this._res(msg.user, Content.START_RESET_IGNORE,contentProps, DialogKey.im_smoking);
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
    await this._res(msg.user, Content.START_RESET_TO_STAGE_1);
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
    await this._res(msg.user, Content.START_RESET_TO_STAGE_2, contentProps, DialogKey.im_smoking);
  }
}