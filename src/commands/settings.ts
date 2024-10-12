import TelegramBot from "node-telegram-bot-api";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { Content, DialogKey, Lang } from "../constants";
import { UsersRepo } from "../db";
import logger from "../logger";

export class Settings {
  constructor() {
    this.onLang = this.onLang.bind(this);
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
   * @see {import('./actions').Actions#onStart}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onStart(...args: unknown[]): Promise<void> {
    logger.error("Method this.onStart is not implemented");
    return Promise.resolve();
  }

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
   * Timezone
   */
  @transformMsg
  @onlyForKnownUsers
  public async onMessage(msg: TelegramBot.Message) {
    if (msg.user.timezone || !/^([a-z]+-?)+$/i.test(msg.text!)) {
      return Promise.resolve();
    }
    // const locations = await node_geocoder.geocode(cityName);

  }
}