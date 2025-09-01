import TelegramBot from "node-telegram-bot-api";
import { DateTime } from "luxon";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { Content, DialogKey, Difficulty, HourFormat, Lang, TimeShifting } from "../constants";
import { computeTimeOffsetBasedOnInput, mssToTime } from "../lib_helpers/luxon";
import { difficultyNameByLevel } from "../helpers";
import { UsersRepo } from "../db";
import logger from "../logger";
import { IGNORE_TIME } from "./constants";

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
    const difficultyName = difficultyNameByLevel(difficulty, msg.user.lang);
    await this._res(msg.user, Content.DIFFICULTY_SELECTED, { difficulty: difficultyName });
    if (!msg.user.timezone) {
      return this.newLocalTime(msg);
    }
    return this.onSettingsDone(msg);
  }

  /**
   * Methods to set local time
   * @param msg
   */
  @transformMsg
  @onlyForKnownUsers
  public async newLocalTime(msg: TelegramBot.Message) {
    await UsersRepo.updateUser(msg, { timezone: undefined });
    const time_sample = DateTime.fromMillis(Date.now()).toFormat(HourFormat.H24);
    await this._res(msg.user, Content.LOCAL_TIME_NEW, { time_sample });
  }

  private async localTimeDialog(msg: TelegramBot.Message) {
    const local_time = mssToTime(msg.ts, msg.user);
    await this._res(msg.user, Content.LOCAL_TIME, { local_time }, DialogKey.local_time);
  }

  @transformMsg
  @onlyForKnownUsers
  public async localTimeDialogCall(msg: TelegramBot.Message) {
    await this.localTimeDialog(msg);
  }

  @transformMsg
  @onlyForKnownUsers
  public async makeATimeShift(msg: TelegramBot.Message, timeShift: TimeShifting) {
    if (timeShift === TimeShifting.Confirmed) {
      // TODO: confirm dialog
      return;
    }
    /*
    const deltaMinutes = {
      [TimeShifting.Plus_1H]: 60,
      [TimeShifting.Minus_1H]: -60,
      [TimeShifting.Plus_30Min]: 30,
      [TimeShifting.Minus_30Min]: -30,
    }[timeShift];
     */
    await this.localTimeDialog(msg);
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
    // apply timezone only if timezone is undefined
    if (msg.user.timezone) {
      return Promise.resolve();
    }
    if (!/^([0-1]\d|2[0-3]):[0-5]\d$/.test(msg.text!.trim())) {
      return;
    }
    try {
      const timezone= computeTimeOffsetBasedOnInput(msg);
      await UsersRepo.updateUser(msg, { timezone });
      const local_time = DateTime.utc().setZone(timezone).toFormat(HourFormat.H24);
      await this._res(msg.user, Content.LOCAL_TIME, { local_time }, DialogKey.local_time);

      // const dateTime = DateTime.fromMillis(Date.now(), { zone });
      // const time_h12 = dateTime.toFormat(HourFormat.H12);
      // const time_h24 = dateTime.toFormat(HourFormat.H24);
      // const dialogKeys: InlineKeyboard = [
      //   [buttonFor(BTN.Timezone_Incorrect, msg.user.lang)],
      //   [
      //     { text: time_h12, callback_data: BTN.Timezone_Correct_H12 },
      //     { text: time_h24, callback_data: BTN.Timezone_Correct_H24 },
      //   ],
      // ];
      // await this._res(msg.user, Content.TIMEZONE_SELECTED, { timezone: msg.text, local_time: time_h24 }, dialogKeys);
    } catch (error) {
      logger.debug("Save timezone error", error);
      await this._res(msg.user, Content.TIMEZONE_INVALID);
      return Promise.resolve();
    }
  }

  @transformMsg
  @onlyForKnownUsers
  public async timezoneCorrect(msg: TelegramBot.Message, hourFormat: HourFormat) {
    if (msg.user.difficulty) {
      await UsersRepo.updateUser(msg, { hourFormat });
      return this.onSettingsDone(msg);
    }
    await UsersRepo.updateUser(msg, { hourFormat, difficulty: Difficulty.EASY });
    await this._res(msg.user, Content.DIFFICULTY_AUTO);
    const oneMinute = 60 * 1000;
    setTimeout(() => {
      this.onSettingsDone(msg);
    }, oneMinute);
  }

  /**
   * When everything is set up
   * @private
   */
  private async onSettingsDone(msg: TelegramBot.Message) {
    if (!msg.user.deltaTime || !msg.user.timezone) {
      logger.error("Incorrect call of onSettingsDone");
      return;
    }
    // stage 1 user
    if (!msg.user.nextTime && !msg.user.ignoreTime) {
      await this._res(msg.user, Content.SETTINGS_DONE);
      const nextTime = msg.ts + msg.user.deltaTime * 60 * 1000;
      await UsersRepo.updateUser(msg, {
        nextTime,
        ignoreTime: msg.ts + IGNORE_TIME,
      });
      const time_to_get_smoke = mssToTime(nextTime, msg.user);
      await this._res(msg.user, Content.STAGE_2_INITIAL, { time_to_get_smoke }, DialogKey.im_smoking);
      return;
    }
    // stage 2 user without next time
    if (!msg.user.nextTime) {
      await this._res(msg.user, Content.SETTINGS_UPDATED_ON_IDLE, {}, DialogKey.im_smoking);
      return;
    }
    // stage 2 normal
    const time_to_get_smoke = mssToTime(msg.user.nextTime, msg.user);
    await this._res(msg.user, Content.SETTINGS_UPDATED, { time_to_get_smoke }, DialogKey.im_smoking);
  }
}