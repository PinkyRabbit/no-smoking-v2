import TelegramBot from "node-telegram-bot-api";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { Content, DialogKey, Difficulty, Lang } from "../constants";
import { getNextSmokingTime } from "../lib_helpers/luxon";
import { difficultyNameByLevel } from "../helpers";
import { UsersRepo } from "../db";
import logger from "../logger";

export class Settings {
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
    await UsersRepo.updateUser(msg, { lang });
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
    await UsersRepo.updateUser(msg, { difficulty });
    const difficultyName = difficultyNameByLevel(msg.user.lang, difficulty);
    await this._res(msg.user, Content.DIFFICULTY_SELECTED, { difficulty: difficultyName });
    if (!msg.user.timezone) {
      return this.onTimezone(msg);
    }
    return this.onSettingsDone(msg);
  }

  /**
   * Timezone
   */
  @transformMsg
  @onlyForKnownUsers
  public async onTimezone(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, { timezone: undefined });
    await this._res(msg.user, Content.TIMEZONE);
    await this._image(msg.user, "timezone.jpg", "Timezone with Google");
  }

  @transformMsg
  public async onMessage(msg: TelegramBot.Message) {
    // not for new users
    if (!msg.user) {
      return Promise.resolve();
    }
    // not for Stage 1 users
    if (!msg.user.minDeltaTime) {
      return Promise.resolve();
    }
    // not for users with timezone
    if (msg.user.timezone) {
      return Promise.resolve();
    }
    // difficulty level should be set before timezone
    if (!msg.user.difficulty && !msg.user.timezone) {
      return Promise.resolve();
    }
    try {
      await UsersRepo.setTimezone(msg, msg.text!.trim());
    } catch(error) {
      logger.debug("Save timezone error", error);
      await this._res(msg.user, Content.TIMEZONE_INVALID);
      return Promise.resolve();
    }
    await this._res(msg.user, Content.TIMEZONE_SELECTED, { timezone: msg.text });
    if (!msg.user.difficulty) {
      return this.onLevel(msg);
    }
    return this.onSettingsDone(msg);
  }

  /**
   * When everything is set up
   * @private
   */
  private async onSettingsDone(msg: TelegramBot.Message) {
    await this._res(msg.user, Content.SETTINGS_DONE);
    if (msg.user.nextTime || !msg.user.timezone) {
      logger.error("Incorrect call of onSettingsDone");
      return;
    }
    const time_to_get_smoke = getNextSmokingTime(msg);
    await this._res(msg.user, Content.STAGE_2_INITIAL,  { time_to_get_smoke }, DialogKey.im_smoking);
  }
}