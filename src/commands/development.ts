import TelegramBot from "node-telegram-bot-api";
import logger from "../logger";
import { Content } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { devModeOnly, onlyForKnownUsers, transformMsg } from "./decorators";
import { User, UsersRepo } from "../db";
import { STAGE_1_MIN, STAGE_1_STEPS } from "./constants";

/**
 * Class for development actions
 * @remark This class should be inherited by Actions class
 */
export class DevActions {
  constructor() {
    this.onDev = this.onDev.bind(this);
    this.devModeDisabled = this.devModeDisabled.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _res(...args: unknown[]): Promise<void> {
    logger.error("Method this._res is not implemented");
    return Promise.resolve();
  }

  /**
   * This method is called by "devModeOnly" decorator when dev mode is disabled
   */
  public async devModeDisabled(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, Content.DEV_OFF);
  }

  @devModeOnly
  public async onDev(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, Content.DEV, { buttons: buttonsFor(DialogKey.dev) });
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devOnDel(msg: TelegramBot.Message) {
    await UsersRepo.removeUser(msg.chat.id);
    await this._res(msg.chat.id, Content.DEV_USER_DELETED);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devResetToStage1(msg: TelegramBot.Message) {
    const update: Partial<User> = {
      tgLastCallTime: 0,
      lastTime: 0,
      nextTime: 0,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
    };
    await UsersRepo.updateUser(msg.chat.id, update);
    await this._res(msg.chat.id, Content.DEV_TO_STAGE_1);
  }

  @devModeOnly
  @transformMsg
  @onlyForKnownUsers
  public async devFillStage1(msg: TelegramBot.Message) {
    const value = STAGE_1_MIN + 1;
    const update: Partial<User> = {
      tgLastCallTime: msg.date - 60 * 60,
      lastTime: Date.now() - (60 * 60 * 1000),
      nextTime: 0,
      minDeltaTimesInitial: new Array(STAGE_1_STEPS).fill(value),
    };
    await UsersRepo.updateUser(msg.chat.id, update);
    const contentProps = { min: value };
    await this._res(msg.chat.id, Content.DEV_FILL_STAGE_1, { contentProps });
  }
}