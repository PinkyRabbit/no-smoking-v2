import TelegramBot from "node-telegram-bot-api";
import logger from "../logger";
import { Content, DialogKey, Difficulty, Motivizer } from "../constants";
import { dateNow } from "../lib_helpers/luxon";
import { User, UsersRepo } from "../db";
import { devModeOnly, onlyForKnownUsers, transformMsg } from "./decorators";
import { STAGE_1_MAX, MIN_INTERVAL, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { getContent } from "../content";

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
    while (minDeltaTimesInitial.length < STAGE_1_STEPS - 1) {
      stepsAdded += 1;
      minDeltaTimesInitial.push(MIN_INTERVAL + 1);
    }
    const update: Partial<User> = {
      lastTime: dateNow() - (60 * 60 * 1000),
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
  public async devToIdle(msg: TelegramBot.Message) {
    const moreThanMax = USER_IDLE_TIME + 1;
    const lastTime = dateNow() - (moreThanMax * 60 * 1000);
    const update: Partial<User> = {
      lastTime,
      nextTime: lastTime + msg.user.deltaTime * 60 * 1000,
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
    let nextMotivizer = to;
    if (!nextMotivizer) {
      const motivizer = getContent(msg.user.lang, Motivizer);
      nextMotivizer = motivizer.length - 1;
    }
    const update: Partial<User> = { motivizerIndex: nextMotivizer };
    await UsersRepo.updateUser(msg, update);
    await this._res(msg.user, Content.DEV_MOTIVIZER);
  }
}