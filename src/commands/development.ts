import TelegramBot from "node-telegram-bot-api";
import logger from "../logger";
import { Content, DialogKey, Difficulty, Lang, Motivizer } from "../constants";
import { dateNow, getFormattedStartDate, mssToTime } from "../lib_helpers/luxon";
import { User, UsersRepo } from "../db";
import { devModeOnly, onlyForKnownUsers, transformMsg } from "./decorators";
import { MIN_INTERVAL, STAGE_1_MAX, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { getContent } from "../content";
import { minsToTimeString } from "../lib_helpers/humanize-duration";
import { difficultyNameByLevel, penaltyMinutesString, stepByDifficulty } from "../helpers";

/**
 * Class for development actions
 * @remark This class should be inherited by Actions class
 */
export class DevActions {
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
    const update: Partial<User> = {
      lastTime: 0,
      nextTime: 0,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
      timezone: undefined,
      difficulty: Difficulty.DOESNT_SET,
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_TO_STAGE_1);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devFillStage1(msg: TelegramBot.Message) {
    const minDeltaTimesInitial = [...msg.user.minDeltaTimesInitial];
    let stepsAdded = 0;
    const validInterval = MIN_INTERVAL + 1;
    while (minDeltaTimesInitial.length < STAGE_1_STEPS - 1) {
      stepsAdded += 1;
      minDeltaTimesInitial.push(validInterval);
    }
    const update: Partial<User> = {
      lastTime: dateNow() - (validInterval * 60 * 1000),
      nextTime: 0,
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
    const moreThanMax = STAGE_1_MAX + 1;
    const update: Partial<User> = {
      lastTime: dateNow() - (moreThanMax * 60 * 1000),
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_STAGE_1_MORE_THAN_MAX);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devToIdle(msg: TelegramBot.Message, isEmpty = false, { isThree, isMax }: Record<string, boolean> = {}) {
    const moreThanMax = USER_IDLE_TIME + 1;
    const lastTime = dateNow() - (moreThanMax * 60 * 1000);
    const update: Partial<User> = {
      lastTime,
      nextTime: lastTime + msg.user.deltaTime * 60 * 1000,
      cigarettesInDay: isEmpty ? 0 : 2,
      penalty: isEmpty ? 0 : 2,
      penaltyDays: isThree ? 2 : 0,
      deltaTime: isMax ? USER_IDLE_TIME : msg.user.deltaTime,
    };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_TO_IDLE);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devByTimer(msg: TelegramBot.Message) {
    const validInterval = MIN_INTERVAL + 1;
    const update: Partial<User> = {
      lastTime: dateNow() - (validInterval * 60 * 1000),
      nextTime: dateNow() - 60 * 1000,
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
      const messageStart = getContent(msg.user.lang, Content.ON_IDLE_START, { cigarettes: 7 });
      const messageEnd = getContent(msg.user.lang, Content.ON_IDLE_END, {
        prev_delta: minsToTimeString(71, msg.user.lang),
        new_delta: minsToTimeString(72, msg.user.lang),
        time_to_get_smoke: mssToTime(1704120600000, msg.user.timezone!),
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
    const validInterval = MIN_INTERVAL + 1;
    const update: Partial<User> = {
      lastTime: dateNow() - (validInterval * 60 * 1000),
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
    stage_1_left: "12"
  });

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devContent(msg: TelegramBot.Message) {
    const contentKey: Content = Content.PENALTY_3;
    const dialogKey: DialogKey = DialogKey.im_smoking;
    // const dialogKey = undefined;
    const fakeProps = this.getDevContentProps(msg.user);
    await this._res(msg.user, contentKey, fakeProps, dialogKey);
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