import TelegramBot from "node-telegram-bot-api";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { Content, DialogKey, Difficulty, Lang } from "../constants";
import { difficultyNameByLevel, isValidTimezoneCheck } from "../helpers";
import { UsersRepo } from "../db";
import logger from "../logger";

export class Settings {
  constructor() {}

  /**
   * @see {import('./actions').Actions#_res}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _res(...args: unknown[]): Promise<void> {
    logger.error("Method this._res is not implemented");
    return Promise.resolve();
  }

  /**
   * @see {import('./actions').Actions#_image}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _image(...args: unknown[]): Promise<void> {
    logger.error("Method this._image is not implemented");
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
   * Level
   */
  @transformMsg
  @onlyForKnownUsers
  public async onLevel(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.DIFFICULTY, {}, DialogKey.difficulty);
  }

  @transformMsg
  @onlyForKnownUsers
  public async changeLevelHandler(msg: TelegramBot.Message, difficulty: Difficulty) {
    await UsersRepo.updateUser(msg.chat.id, { difficulty });
    const difficultyName = difficultyNameByLevel(msg.user.lang, difficulty);
    await this._res(msg.user, Content.DIFFICULTY_SELECTED, { difficulty: difficultyName });
  }

  /**
   * Timezone
   */
  @transformMsg
  @onlyForKnownUsers
  public async onTimezone(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg.chat.id, { timezone: null });
    await this._image(msg.user, "timezone.jpg", "Timezone with Google");
    await this._res(msg.user, Content.TIMEZONE);
  }

  @transformMsg
  @onlyForKnownUsers
  public async onMessage(msg: TelegramBot.Message) {
    if (msg.user.timezone) {
      return Promise.resolve();
    }
    const text = msg.text!.trim();
    if (isValidTimezoneCheck(text)) {
      const timezone = text;
      await UsersRepo.updateUser(msg.chat.id, { timezone });
      await this._res(msg.user, Content.TIMEZONE_SELECTED, { timezone });
    }
  }
}