import TelegramBot from "node-telegram-bot-api";
import TgBot from "../telegram-bot";
import { join as pathJoin } from "path";
import { Mixin } from "ts-mixer";
import { ContentProps, getContent, getButtons } from "../content";
import { Content, DialogKey, Motivizer } from "../constants";
import { DevActions } from "./development";
import { Settings } from "./settings";
import { User, UsersRepo } from "../db";
import { MIN_INTERVAL, STAGE_1_MAX, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { LogActionCalls, onlyForKnownUsers, transformMsg } from "./decorators";
import { tgLangCodeToLang } from "../lib_helpers/i18n";
import { getNextSmokingTime, tsToDateTime } from "../lib_helpers/luxon";
import logger from "../logger";
import { stage2 } from "./decorators/stage2";

@LogActionCalls
export class Actions extends Mixin(DevActions, Settings) {
  constructor(private bot: TgBot) {
    super();
    this.bot = bot;
    // all "on" methods should be bound with "this"
    this.onStart = this.onStart.bind(this);
    this.onLevel = this.onLevel.bind(this);
    this.onLang = this.onLang.bind(this);
    this.onTimezone = this.onTimezone.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onUserUnknown = this.onUserUnknown.bind(this);
    this.onDev = this.onDev.bind(this);
    this.devModeDisabled = this.devModeDisabled.bind(this);
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

  protected override _resV2( chatId: number, content: string  ): Promise<void> {
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
  protected override _image(
    user: User,
    fileName: string,
    caption: string
  ): Promise<void> {
    const path = pathJoin(__dirname, `../../images/${fileName}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.bot.sendPhoto(user.chatId, path, { caption })
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
  private computeNewDelta = ({ deltaTime, difficulty, penalty, minDeltaTime }: Pick<User, "deltaTime" | "difficulty" | "penalty" | "minDeltaTime">) => {
    const newDelta = ((deltaTime * 10)  + (difficulty * 10) - (penalty * 10)) / 10;
    return newDelta >= minDeltaTime ? newDelta : minDeltaTime;
  };

  /**
   * This method is called by decorator "onlyForKnownUsers",
   * when non-authorized user trying to make a call to private route
   * @see {onlyForKnownUsers} - decorator
   */
  public async onUserUnknown(msg: TelegramBot.Message) {
    const fakeUser = { chatId: msg.chat.id, lang: tgLangCodeToLang(msg.from!.language_code) } as User;
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
   * Stage 1
   */
  private async _stage1(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      lastTime: msg.ts,
    };
    if (!msg.user.lastTime) {
      await UsersRepo.updateUser(msg, update);
      await this._res(msg.user, Content.FIRST_STEP, { stage_1_left: STAGE_1_STEPS }, DialogKey.im_smoking);
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
    return this.onLevel(msg);
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
      await this._res(msg.user, Content.STAGE_2_IGNORE_MIN, { min_interval: minsToTimeString(MIN_INTERVAL) });
      return;
    }
    const update: Partial<User> = {
      lastTime: msg.ts,
      nextTime: msg.ts + (msg.user.deltaTime * 60 * 1000),
      ignoreTime: msg.ts + (2 * 24 * 60 * 1000),
    };
    // penalty
    if (msg.ts < msg.user.nextTime) {
      logger.debug(`U-${msg.user.chatId} [penalty] ${tsToDateTime(msg.ts)} < ${tsToDateTime(msg.user.nextTime)}`);
      const penalty = ((msg.user.penalty * 10) + (msg.user.difficulty * 10)) / 10;
      update.penalty = penalty;
      await this._res(msg.user, Content.PENALTY, { penalty });
    }
    // idle
    if (currentDelta >= USER_IDLE_TIME) {
      logger.debug(`U-${msg.user.chatId} [idle] ${currentDelta} >= ${USER_IDLE_TIME}`);
      const { deltaTime, difficulty, penalty } = msg.user;
      const newDelta = this.computeNewDelta(msg.user);
      const newNextTime = msg.ts + (newDelta * 60 * 1000);
      update.penalty = 0;
      update.deltaTime = newDelta;
      update.nextTime = newNextTime;
      const content: string[] = [];
      content.push(getContent(msg.user.lang, Content.ON_IDLE_START));

      const motivizer = getContent(msg.user.lang, Motivizer);
      content.push(motivizer[msg.user.motivizerIndex]);
      const motivizerNext = msg.user.motivizerIndex + 1;
      update.motivizerIndex = motivizerNext !== motivizer.length ? motivizerNext : 0;

      content.push(getContent(msg.user.lang, Content.ON_IDLE_END, {
        prev_delta: minsToTimeString(deltaTime, msg.user.lang),
        new_delta: minsToTimeString(newDelta, msg.user.lang),
        time_to_get_smoke: getNextSmokingTime(msg, newDelta),
        penalty: minsToTimeString(penalty, msg.user.lang),
        step: minsToTimeString(difficulty, msg.user.lang),
      }));
      const { reply_markup } = getButtons(msg.user.lang, DialogKey.im_smoking);
      const ops: TelegramBot.SendMessageOptions = { parse_mode: "MarkdownV2", reply_markup };
      await this.bot.sendMessage(msg.user.chatId, content.join(""), ops);
    }
    // normal stage 2
    if (currentDelta < USER_IDLE_TIME) {
      const time_to_get_smoke = getNextSmokingTime(msg);
      await this._res(msg.user, Content.STAGE_2, { time_to_get_smoke }, DialogKey.im_smoking);
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
  public async resetIgnoreHandler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, {
      lastTime: 0,
      nextTime: 0,
    });
    const contentProps = { min_delta: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.user, Content.START_RESET_IGNORE,contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  public async resetToStage1Handler(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, {
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
    await UsersRepo.updateUser(msg, {
      lastTime: 0,
      nextTime: 0,
      deltaTime: msg.user.minDeltaTime,
    });
    const contentProps = { min_delta: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.user, Content.START_RESET_TO_STAGE_2, contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  public async ignoreBusy(msg: TelegramBot.Message) {
    const contentProps = { delta_time: minsToTimeString(msg.user.minDeltaTime, msg.user.lang) };
    await this._res(msg.user, Content.BOT_IGNORE_BUSY, contentProps, DialogKey.im_smoking);
  }

  @transformMsg
  @onlyForKnownUsers
  public async ignorePenalty10(msg: TelegramBot.Message) {
    const newDelta = this.computeNewDelta({ ...msg.user, penalty: 10 });
    await UsersRepo.updateUser(msg, { deltaTime: newDelta });
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
}