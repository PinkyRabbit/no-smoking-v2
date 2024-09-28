import TelegramBot from "node-telegram-bot-api";
import { Content, contentFor } from "../content";
import { buttonsFor, DialogKey } from "../buttons";

export class DevActions {
  constructor() {
    this.onDev = this.onDev.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _res(...args: unknown[]): Promise<void> {
    console.log("Method this._res is not implemented");
    return Promise.resolve();
  }

  public async onDev(msg: TelegramBot.Message) {
    await this._res(msg.chat.id, contentFor(Content.DEV), buttonsFor(DialogKey.dev));
  }
}