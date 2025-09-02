import TelegramBot from "node-telegram-bot-api";
import TgBot from "../telegram-bot";
import { join as pathJoin } from "path";
import { Mixin } from "ts-mixer";
import { ContentProps, getContent } from "../content";
import { Content, DialogKey, Difficulty, HourFormat, Motivizer, YouCan } from "../constants";
import { DevActions } from "./development";
import { Settings } from "./settings";
import { User, UsersRepo } from "../db";
import { IGNORE_TIME, MIN_INTERVAL, STAGE_1_MAX, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { daysToString, minsToTimeString } from "../lib_helpers/humanize-duration";
import { LogActionCalls, onlyForKnownUsers, transformMsg } from "./decorators";
import { tgLangCodeToLang } from "../lib_helpers/i18n";
import { getFormattedStartDate, mssToTime, tsToDateTime } from "../lib_helpers/luxon";
import logger from "../logger";
import { stage2 } from "./decorators/stage2";
import { cigarettesText } from "../helpers/content";
import { penaltyByDifficulty, penaltyMinutesString, stepByDifficulty } from "../helpers";
import { InlineKeyboard } from "../content/types";
import { Analytics } from "../analytics";

@LogActionCalls
export class Actions extends Mixin(DevActions, Settings) {
  private readonly analytics: Analytics;

  constructor(private bot: TgBot) {
    super();
    this.bot = bot;
    this.analytics = new Analytics();
    // all "on" methods should be bound with "this"
    this.onStart = this.onStart.bind(this);
    this.onLevel = this.onLevel.bind(this);
    this.onLang = this.onLang.bind(this);
    this.localTimeDialogCall = this.localTimeDialogCall.bind(this);
    this.onStats = this.onStats.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onUserUnknown = this.onUserUnknown.bind(this);
    this.onDev = this.onDev.bind(this);
    this.onHow = this.onHow.bind(this);
    this.devModeDisabled = this.devModeDisabled.bind(this);
  }

  override _res(
    user: User,
    contentKey: Content,
    contentProps: ContentProps = {},
    dialogKey?: DialogKey | InlineKeyboard,
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

  protected override _resV2(chatId: number, content: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const ops: TelegramBot.SendMessageOptions = { parse_mode: "MarkdownV2" };
        this.bot.sendMessage(chatId, content, ops);
        resolve();
      }, 400);
    });
  }

  /**
   * Method to send an image
   * @protected
   */
  protected override _image(user: User, fileName: string, caption: string): Promise<void> {
    const path = pathJoin(__dirname, `../../images/${fileName}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.bot
          .sendPhoto(user.chatId, path, { caption })
          .catch((error) => {
            logger.error(`U-${user.chatId} -> Can't send an image ${path}`, { error });
          })
          .finally(() => resolve());
      }, 400);
    });
  }

  /**
   * Helper to calculate new delta time
   */
  public _computeNewDelta = (
    {
      deltaTime,
      difficulty,
      penalty,
      minDeltaTime,
    }: Pick<User, "deltaTime" | "difficulty" | "penalty" | "minDeltaTime">,
    isTenMinPenalty?: boolean,
  ) => {
    if (isTenMinPenalty) {
      const newDeltaTime = deltaTime - 10;
      return newDeltaTime >= minDeltaTime ? newDeltaTime : minDeltaTime;
    }
    const deltaTimeInt = deltaTime * 10;
    const stepInt = stepByDifficulty(difficulty) * 10;
    const penaltyInt = penaltyByDifficulty(difficulty, penalty) * 10;
    const newDelta = (deltaTimeInt + stepInt - penaltyInt) / 10;
    return newDelta >= minDeltaTime ? newDelta : minDeltaTime;
  };

  /**
   * This method is called by decorator "onlyForKnownUsers",
   * when non-authorized user trying to make a call to private route
   * @see {onlyForKnownUsers} - decorator
   */
  public async onUserUnknown(msg: TelegramBot.Message) {
    const fakeUser = {
      chatId: msg.chat.id,
      lang: tgLangCodeToLang(msg.from!.language_code),
      hourFormat: HourFormat.H24,
    } as unknown as User;
    await this._res(fakeUser, Content.USER_UNKNOWN, {}, DialogKey.to_start);
  }

  /**
   * This route to protect stage 2 from calls by users without required properties
   * @see {stage2} - decorator
   */
  public async stage2Protected(msg: TelegramBot.Message) {
    const admin_email = process.env.ADMIN_EMAIL;
    await this._res(msg.user, Content.STAGE_2_PROPS_MISSING, { admin_email });
  }

  /**
   * Start. Step 1
   */
  @transformMsg
  public async onStart(msg: TelegramBot.Message) {
    if (!msg.user) {
      const user = await UsersRepo.addNewUser(msg);
      await this.analytics.trackTgLang(msg.from?.language_code || "Unknown");
      await this._res(user, Content.START_NEW, {}, DialogKey.beginning);
      return;
    }
    await UsersRepo.updateUser(msg, { startDate: new Date(), penaltyAll: 0 });
    if (!msg.user.minDeltaTime) {
      await UsersRepo.updateUser(msg, {
        lastTime: 0,
        nextTime: 0,
        ignoreTime: 0,
        minDeltaTimesInitial: [],
      });
      await this._res(msg.user, Content.START_EXISTING_STAGE_1);
      await this.toStage1(msg);
      return;
    }
    const min_delta = minsToTimeString(msg.user.minDeltaTime, msg.user.lang);
    const delta_time = minsToTimeString(msg.user.deltaTime || msg.user.minDeltaTime, msg.user.lang);
    await this._res(msg.user, Content.START_EXISTING, { min_delta, delta_time }, DialogKey.start_existing);
  }

  /**
   * Start. Step 2
   */
  @transformMsg
  @onlyForKnownUsers
  public async toStage1(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.STAGE_1, {}, DialogKey.im_smoking);
  }

  /**
   * Stage 1
   */
  private async _stage1(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      lastTime: msg.ts,
    };
    if (!msg.user.lastTime) {
      update.cigarettesSummary = 1;
      await UsersRepo.updateUser(msg, update);
      await this._res(msg.user, Content.FIRST_STEP, { stage_1_left: STAGE_1_STEPS }, DialogKey.im_smoking);
      return;
    }
    const timeDifferenceMs = msg.ts - msg.user.lastTime;
    const deltaTime = Math.round(timeDifferenceMs / 60 / 1000); // in minutes
    let isValidDeltaTime = true;
    let deltaTimesLeft = STAGE_1_STEPS - msg.user.minDeltaTimesInitial.length;
    // to ignore if user clicking too often
    if (deltaTime < MIN_INTERVAL) {
      logger.debug(`deltaTime < MIN_INTERVAL, ${deltaTime} < ${MIN_INTERVAL}`);
      isValidDeltaTime = false;
      update.lastTime = msg.user.lastTime;
      const contentProps = { min_stage_1: minsToTimeString(MIN_INTERVAL, msg.user.lang), stage_1_left: deltaTimesLeft };
      await this._res(msg.user, Content.STAGE_1_IGNORE_MIN, contentProps, DialogKey.im_smoking);
    } else {
      update.cigarettesSummary = msg.user.cigarettesSummary + 1;
    }
    // to skip calculation if delta is too big
    if (deltaTime > STAGE_1_MAX) {
      logger.debug(`deltaTime > STAGE_1_MAX ${deltaTime} > ${STAGE_1_MAX}`);
      isValidDeltaTime = false;
      const contentProps = { max_stage_1: STAGE_1_MAX, stage_1_left: deltaTimesLeft };
      await this._res(msg.user, Content.STAGE_1_IGNORE_MAX, contentProps, DialogKey.im_smoking);
    }
    // add time if timestamp is valid
    if (isValidDeltaTime) {
      deltaTimesLeft -= 1;
      update.minDeltaTimesInitial = msg.user.minDeltaTimesInitial.concat(deltaTime);
    }
    if (isValidDeltaTime && msg.user.minDeltaTimesInitial.length > 3) {
      const currentDeltaValues = msg.user.minDeltaTimesInitial;
      const deltaSum = currentDeltaValues.reduce((acc, curr) => acc + curr, 0);
      const currentDelta = deltaSum / currentDeltaValues.length;
      if (deltaTime > currentDelta * 2) {
        await this._res(msg.user, Content.STAGE_1_YOU_CAN_RESET);
      }
    }
    if (isValidDeltaTime && deltaTimesLeft > 0) {
      await this._res(msg.user, Content.STAGE_1_PROCESSING, { stage_1_left: deltaTimesLeft }, DialogKey.im_smoking);
    }
    if (!isValidDeltaTime || deltaTimesLeft > 0) {
      await UsersRepo.updateUser(msg, update);
      return;
    }
    // on complete
    const summaryStage1Delta = update.minDeltaTimesInitial!.reduce((a, b) => a + b, 0);
    const stage1DeltaCount = update.minDeltaTimesInitial!.length;
    const stage1DeltaAvg = Math.round(summaryStage1Delta / stage1DeltaCount);
    update.minDeltaTimesInitial = [];
    update.minDeltaTime = stage1DeltaAvg;
    update.deltaTime = stage1DeltaAvg;
    const contentProps = { delta_time: minsToTimeString(stage1DeltaAvg, msg.user.lang) };
    await this._res(msg.user, Content.STAGE_1_END, contentProps);
    await this._res(msg.user, Content.SETTINGS);
    await UsersRepo.updateUser(msg, update);
    return this.newLocalTime(msg);
  }

  /**
   * Stage 2
   */
  @stage2
  private async _stage2(msg: TelegramBot.Message) {
    const timeDifferenceMs = msg.ts - msg.user.lastTime;
    const currentDelta = Math.round(timeDifferenceMs / 60 / 1000); // in minutes
    logger.debug(`timeDifferenceMs = ${msg.ts} - ${msg.user.lastTime} = ${currentDelta} min (${Math.floor(currentDelta / 60 / 24)} days)`);
    // ignore spam
    if (currentDelta < MIN_INTERVAL) {
      await this._res(msg.user, Content.STAGE_2_IGNORE_MIN, { min_interval: minsToTimeString(MIN_INTERVAL, msg.user.lang) });
      return;
    }
    const update: Partial<User> = {
      lastTime: msg.ts,
      nextTime: msg.ts + (msg.user.deltaTime * 60 * 1000),
      ignoreTime: msg.ts + IGNORE_TIME,
      cigarettesInDay: msg.user.cigarettesInDay + 1,
      cigarettesSummary: msg.user.cigarettesSummary + 1,
    };
    // penalty
    const isPenalty = msg.ts < msg.user.nextTime;
    if (isPenalty) {
      logger.debug(`U-${msg.user.chatId} [penalty] ${tsToDateTime(msg.ts)} < ${tsToDateTime(msg.user.nextTime)}`);
      update.penalty = msg.user.penalty + 1;
      update.penaltyAll = msg.user.penaltyAll + 1;
      update.winstrike = 0;
      await this._res(msg.user, Content.PENALTY, { penalty: update.penalty });
    }
    // idle
    const isIdle = currentDelta >= USER_IDLE_TIME;
    if (isIdle && !msg.user.cigarettesInDay) {
      const time_to_get_smoke = mssToTime(update.nextTime!, msg.user);
      await this._res(msg.user, Content.IDLE_NO_CIGARETTES, { time_to_get_smoke }, DialogKey.im_smoking);
    }
    const isNonEmptyIdle = isIdle && msg.user.cigarettesInDay > 0;
    if (isNonEmptyIdle) {
      // normal idle update
      logger.debug(`U-${msg.user.chatId} [idle] ${currentDelta} >= ${USER_IDLE_TIME}`);
      const isMaxTimeLimitReached = msg.user.deltaTime >= USER_IDLE_TIME - 5;
      const newDelta = isMaxTimeLimitReached ? msg.user.deltaTime : this._computeNewDelta(msg.user);
      const newNextTime = msg.ts + (newDelta * 60 * 1000);
      update.penalty = 0;
      update.penaltyDays = msg.user.penalty ? msg.user.penaltyDays + 1 : 0;
      update.cigarettesInDay = 0;
      update.deltaTime = newDelta;
      update.nextTime = newNextTime;
      update.winstrike = msg.user.penalty ? 0 : msg.user.winstrike + 1;

      const content: string[] = [];
      const cigarettes = cigarettesText(msg);
      content.push(getContent(msg.user.lang, Content.ON_IDLE_STATS_1, { cigarettes }));

      const motivizer = getContent(msg.user.lang, Motivizer);
      content.push(motivizer[msg.user.motivizerIndex]);
      const motivizerNext = msg.user.motivizerIndex + 1;
      update.motivizerIndex = motivizerNext !== motivizer.length ? motivizerNext : 0;
      const step = stepByDifficulty(msg.user.difficulty);
      content.push(getContent(msg.user.lang, Content.ON_IDLE_STATS_2, {
        prev_delta: minsToTimeString(msg.user.deltaTime, msg.user.lang),
        new_delta: minsToTimeString(newDelta, msg.user.lang),
        penalty: msg.user.penalty,
        penalty_mins: penaltyMinutesString(msg.user),
        step: minsToTimeString(step, msg.user.lang),
      }));
      const ops: TelegramBot.SendMessageOptions = { parse_mode: "MarkdownV2" };
      await this.bot.sendMessage(msg.user.chatId, content.join(""), ops);

      // hint three days penalty
      if (update.penaltyDays === 3) {
        update.penaltyDays = 0;
        await this._res(msg.user, Content.PENALTY_3, {}, DialogKey.difficulty_easy);
      }
      // winstrike messages
      const WINSTRIKE_MIN_DAYS = 3;
      const isEasyDifficulty = msg.user.difficulty === Difficulty.EASY;
      const isWinstrike = update.winstrike > WINSTRIKE_MIN_DAYS - 1;
      if (isWinstrike) {
        const winstrikeDays = daysToString(update.winstrike, msg.user.lang);
        await this._res(msg.user, Content.WINSTRIKE, { winstrike: winstrikeDays });
      }
      if (isEasyDifficulty && isWinstrike) {
        await this._res(msg.user, Content.WINSTRIKE_BASE_SUCCESS);
      }
      if (isEasyDifficulty && !isWinstrike && update.winstrike) {
        const props = { day: update.winstrike, of_days: WINSTRIKE_MIN_DAYS };
        await this._res(msg.user, Content.WINSTRIKE_BASE, props);
      }
      if (isEasyDifficulty && !update.winstrike) {
        await this._res(msg.user, Content.WINSTRIKE_BASE_FAILED);
      }
      // display hint if limit is reached
      if (isMaxTimeLimitReached) {
        await this._res(msg.user, Content.MAXIMUM_REACHED, {}, DialogKey.max_time);
      } else {
        const local_time = mssToTime(msg.ts, msg.user);
        await this._res(msg.user, Content.ON_IDLE_TIME_CONFIRMATION, { local_time }, DialogKey.confirm_local_time);
      }
    }
    // normal stage 2
    if (currentDelta < USER_IDLE_TIME && msg.user.cigarettesInDay === 1) {
      const youCanIndex = msg.user.youCanIndex || 0;
      const youCanContent = getContent(msg.user.lang, YouCan);
      const message = youCanContent[youCanIndex];
      await this.bot.sendMessage(msg.user.chatId, message, { parse_mode: "Markdown" });
      update.youCanIndex = youCanIndex + 2 < youCanContent.length ? youCanIndex + 1 : 0;
    }
    if (currentDelta < USER_IDLE_TIME) {
      const time_to_get_smoke = mssToTime(update.nextTime!, msg.user);
      const content = !isPenalty && msg.user.cigarettesInDay ? Content.STAGE_2_SUCCESS : Content.STAGE_2;
      await this._res(msg.user, content, { time_to_get_smoke }, DialogKey.im_smoking);
    }
    // update user
    await UsersRepo.updateUser(msg, update);
  }

  @transformMsg
  @onlyForKnownUsers
  public async imSmokingHandler(msg: TelegramBot.Message) {
    if (!msg.user.minDeltaTime) {
      return this._stage1(msg);
    }
    return this._stage2(msg);
  }

  /**
   * Existing user /start callbacks
   */
  @transformMsg
  @onlyForKnownUsers
  @stage2
  public async resetIgnoreHandler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, {
      lastTime: 0,
      nextTime: 0,
      penaltyDays: 0,
      winstrike: 0,
    });
    const contentProps = { delta_time: minsToTimeString(msg.user.deltaTime, msg.user.lang) };
    await this._res(msg.user, Content.START_RESET_IGNORE, contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  @stage2
  public async resetToStage1Handler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, {
      lastTime: 0,
      nextTime: 0,
      ignoreTime: 0,
      deltaTime: 0,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
      cigarettesInDay: 0,
      cigarettesSummary: 0,
      penalty: 0,
      penaltyDays: 0,
      penaltyAll: 0,
      winstrike: 0,
    });
    await this._res(msg.user, Content.START_RESET_TO_STAGE_1);
    await this.toStage1(msg);
  }

  @transformMsg
  @onlyForKnownUsers
  @stage2
  public async resetToStage2Handler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, {
      lastTime: 0,
      nextTime: 0,
      cigarettesInDay: 0,
      deltaTime: msg.user.minDeltaTime,
      winstrike: 0,
    });
    const contentProps = { delta_time: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.user, Content.START_RESET_TO_STAGE_2, contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  public async ignoreBusy(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, { ignoreTime: msg.ts + IGNORE_TIME, winstrike: 0 });
    const contentProps = { delta_time: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.user, Content.BOT_IGNORE_BUSY, contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  public async ignorePenalty10(msg: TelegramBot.Message) {
    const newDelta = this._computeNewDelta(msg.user, true);
    await UsersRepo.updateUser(msg, {
      deltaTime: newDelta,
      penaltyAll: msg.user.penaltyAll + 10,
      penaltyDays: 0,
      cigarettesInDay: 0,
      ignoreTime: msg.ts + IGNORE_TIME,
      winstrike: 0,
    });
    const delta_time = minsToTimeString(newDelta, msg.user.lang);
    const delta_min = minsToTimeString(msg.user.minDeltaTime, msg.user.lang);
    const contentProps = { delta_min, delta_time };
    await this._res(msg.user, Content.BOT_IGNORE_PENALTY_10, contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  public async ignoreFailed(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.BOT_IGNORE_FAILED, {}, DialogKey.to_start);
  }

  @transformMsg
  @onlyForKnownUsers
  public async ignoreSuccess(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.BOT_IGNORE_SUCCESS, {});
  }

  @transformMsg
  @onlyForKnownUsers
  @stage2
  public async onStats(msg: TelegramBot.Message) {
    const { start_date, days_from_start } = getFormattedStartDate(msg.user.startDate, msg.user.lang);
    const contentProps = {
      start_date,
      days_from_start,
      penalty_all: minsToTimeString(msg.user.penaltyAll, msg.user.lang),
      delta_min: minsToTimeString(msg.user.minDeltaTime, msg.user.lang),
      delta_time: minsToTimeString(msg.user.deltaTime, msg.user.lang),
      cigarettes: msg.user.cigarettesSummary,
    };
    await this._res(msg.user, Content.STATS, contentProps);
  }

  @transformMsg
  @onlyForKnownUsers
  public async onHow(msg: TelegramBot.Message) {
    const donate_link = process.env.DONATE_LINK;
    const admin_email = process.env.ADMIN_EMAIL;
    await this._res(msg.user, Content.HOW, { donate_link, admin_email });
  }
}