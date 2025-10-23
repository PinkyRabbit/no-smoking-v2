import TelegramBot from "node-telegram-bot-api";
import logger from "../logger";
import { Content, DialogKey, Difficulty, Lang, Motivizer } from "../constants";
import { dateNow, getFormattedStartDate, mssToTime } from "../lib_helpers/luxon";
import { User, UsersRepo } from "../db";
import { devModeOnly, onlyForKnownUsers, transformMsg } from "./decorators";
import { MIN_INTERVAL, STAGE_1_MAX, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { getContent } from "../content";
import { daysToString, minsToTimeString } from "../lib_helpers/humanize-duration";
import { difficultyNameByLevel, penaltyMinutesString, stepByDifficulty } from "../helpers";
import { getIdleVariants } from "../helpers/idle";
import { computeNewDelta } from "../helpers/delta";

/**
 * Class for development actions
 * @remark This class should be inherited by Actions class
 */
export class DevActions {
  private readonly stage1UserParams: Partial<User> = {
    lastTime: 0,
    nextTime: 0,
    minDeltaTime: 0,
    minDeltaTimesInitial: [],
    timezone: undefined,
    difficulty: Difficulty.DOESNT_SET,
  };

  get lastTimeToSmoke() {
    const validInterval = MIN_INTERVAL + 1;
    return dateNow() - (validInterval * 60 * 1000);
  }

  get nextTimeToSmoke() {
    return dateNow() - 60 * 1000;
  }

  /**
   * @see {import('./actions').Actions#_res}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _res(...args: unknown[]): Promise<void> {
    logger.error("Method this._res is not implemented");
    return Promise.resolve();
  }

  /**
   * @see {import('./actions').Actions#_resV2}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _resV2(...args: unknown[]): Promise<void> {
    logger.error("Method this._resV2 is not implemented");
    return Promise.resolve();
  }

  /**
   * This method is called by "devModeOnly" decorator when dev mode is disabled
   */
  public async devModeDisabled(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.DEV_OFF);
  }

  @devModeOnly
  @transformMsg
  public async onDev(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.DEV, {}, DialogKey.dev);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devOnDel(msg: TelegramBot.Message) {
    await UsersRepo.removeUser(msg.chat.id);
    await this._res(msg.user, Content.DEV_USER_DELETED);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devResetToStage1(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, this.stage1UserParams);
    await this._res(msg.user, Content.DEV_TO_STAGE_1);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devFillStage1(msg: TelegramBot.Message) {
    const INTERVAL_STEP = 1;
    const minDeltaTimesInitial = [...msg.user.minDeltaTimesInitial];
    let stepsAdded = 0;
    while (minDeltaTimesInitial.length < STAGE_1_STEPS - 1) {
      stepsAdded += 1;
      minDeltaTimesInitial.push(MIN_INTERVAL + INTERVAL_STEP);
    }
    const update: Partial<User> = {
      ...this.stage1UserParams,
      lastTime: this.lastTimeToSmoke,
      nextTime: this.nextTimeToSmoke,
      minDeltaTimesInitial: minDeltaTimesInitial,
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_FILL_STAGE_1, { stepsAdded });
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devLastTimeMinusHour(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      lastTime: dateNow() - (60 * 60 * 1000),
      nextTime: dateNow() - 1,
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_LAST_TIME_MINUS_HOUR);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devStage1MoreThanMax(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      lastTime: dateNow() - ((STAGE_1_MAX + 1) * 60 * 1000),
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_STAGE_1_MORE_THAN_MAX);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devToIdle(msg: TelegramBot.Message, isEmpty = false, { isThree, isInMaxPossibleDeltaTime }: Record<string, boolean> = {}) {
    const currentDate = dateNow();
    const update: Partial<User> = {
      lastTime: currentDate - ((USER_IDLE_TIME + 1)* 60 * 1000),
      nextTime: currentDate - msg.user.deltaTime * 1000,
      cigarettesInDay: 2,
      penaltyDays: 0,
      deltaTime: msg.user.deltaTime,
    };
    if (isEmpty) {
      update.cigarettesInDay = 0;
    }
    if (isThree) {
      update.difficulty = Difficulty.HARD;
      update.penalty = 1;
      update.penaltyDays = 2;
    }
    if (isInMaxPossibleDeltaTime) {
      update.deltaTime = USER_IDLE_TIME;
    }
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_TO_IDLE);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devByTimer(msg: TelegramBot.Message, isFailed?: boolean) {
    const failedTime = isFailed ? 5 * 60 * 1000 : 0;
    const update: Partial<User> = {
      lastTime: this.lastTimeToSmoke,
      nextTime: this.nextTimeToSmoke + failedTime,
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_NEXT);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devMotivizer(msg: TelegramBot.Message, to?: number) {
    if (!to) {
      const step = stepByDifficulty(msg.user.difficulty);
      const allContent = getContent(msg.user.lang, Motivizer) as unknown as string[];
      const messageStart = getContent(msg.user.lang, Content.ON_IDLE_STATS_1, { cigarettes: 7 });
      const messageEnd = getContent(msg.user.lang, Content.ON_IDLE_STATS_2, {
        prev_delta: minsToTimeString(71, msg.user.lang),
        new_delta: minsToTimeString(72, msg.user.lang),
        time_to_get_smoke: mssToTime(1704120600000, msg.user),
        penalty: 2,
        penalty_mins: penaltyMinutesString(msg.user),
        step: minsToTimeString(step, msg.user.lang),
      });
      while (allContent.length > 0) {
        const motivation = allContent.shift();
        if (!motivation) {
          logger.error("motivation is undefined");
          continue;
        }
        const content: string[] = [];
        content.push(messageStart);
        content.push(motivation);
        content.push(messageEnd);
        await this._resV2(msg.user.chatId, content.join(""));
      }
      return;
    }
    const update: Partial<User> = { motivizerIndex: to };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_MOTIVIZER);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devIgnore(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      lastTime: this.lastTimeToSmoke,
      nextTime: 0,
      ignoreTime: dateNow() - 60 * 1000,
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_IGNORE);
  }

  private getDevContentProps = ({ lang }: User) => ({
    stepsAdded: "5",
    time_to_get_smoke: "17:34",
    admin_email: "usesa@yandex.com",
    delta_min: minsToTimeString(82, lang),
    delta_time: minsToTimeString(128, lang),
    prev_delta: minsToTimeString(91, lang),
    new_delta: minsToTimeString(93, lang),
    step: minsToTimeString(Difficulty.EASY, lang),
    penalty: "3",
    penalty_all: "141",
    penalty_mins: penaltyMinutesString({
      difficulty: Difficulty.HARD,
      penalty: 3,
      lang,
    } as User),
    cigarettes: "217",
    days_from_start: "22",
    start_date: getFormattedStartDate(new Date("2024-02-12"), lang).start_date,
    local_time: "14:08",
    timezone: "+2",
    difficulty: difficultyNameByLevel(Difficulty.HARD, lang),
    min_interval: minsToTimeString(MIN_INTERVAL, lang),
    min_stage_1: minsToTimeString(MIN_INTERVAL, lang),
    max_stage_1: STAGE_1_MAX,
    stage_1_left: "12",
    winstrike: daysToString(5, lang),
  });

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devContent(msg: TelegramBot.Message) {
    const buttonsForIdle = getIdleVariants(msg.user.lang);
    const no_penalty_time = minsToTimeString(msg.user.deltaTime, msg.user.lang);
    const tenMinutesDelta = computeNewDelta(msg.user, true);
    const penalty_10_time= minsToTimeString(tenMinutesDelta, msg.user.lang);
    await this._res(msg.user, Content.BOT_IGNORE, { ...buttonsForIdle, no_penalty_time, penalty_10_time }, DialogKey.ignore);
    /*
      const DAYS_TO_CHANGE_DIFFICULTY = 3;
      const props = { day: msg.user.winstrike, of_days: DAYS_TO_CHANGE_DIFFICULTY };
      await this._res(msg.user, Content.WINSTRIKE_MEDIUM, props);

      await this._res(msg.user, Content.DIFFICULTY_HARD_AUTO);
     */
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devAllContent(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.DEV_LANG, {}, DialogKey.dev_lang);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devAllContentRecursive(msg: TelegramBot.Message, lang: Lang) {
    const callResRecursive = (promises: Array<() => Promise<void>>) => {
      const oneSec = 1000;
      const promiseToCall = promises.shift();
      if (!promiseToCall) {
        return;
      }
      setTimeout(async () => {
        await promiseToCall();
        callResRecursive(promises);
      }, oneSec);
    };
    const user = {  ...msg.user, lang };
    const fakeProps = this.getDevContentProps(user);
    const allContentCalls =
      Object.values(Content).map((contentKey) =>
        () => this._res(user, contentKey, fakeProps)
      );
    return callResRecursive(allContentCalls);
  }
}