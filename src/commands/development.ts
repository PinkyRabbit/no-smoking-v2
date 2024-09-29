import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";
import { devModeOnly } from "./decorators";
import { UsersRepo } from "../db";

/**
 * Class for development actions
 * @remark This class should be inherited by Actions class
 */
export class DevActions {
  constructor() {
    this.onDev = this.onDev.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _res(...args: unknown[]): Promise<void> {
    console.log("Method this._res is not implemented");
    return Promise.resolve();
  }

  @devModeOnly
  public async onDev(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.DEV), buttonsFor(DialogKey.dev));
  }

  /**
   * This method is called by "devModeOnly" decorator when dev mode is disabled
   */
  public async devModeDisabled(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.DEV_OFF));
  }

  @devModeOnly
  public async devOnDel(msg: TelegramBot.Message) {
    await UsersRepo.removeUser(msg.chat.id);
    await this._res(msg.chat.id, contentFor(Content.DEV_USER_DELETED));
  }
}