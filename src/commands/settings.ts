import TelegramBot from "node-telegram-bot-api";
import { DateTime } from "luxon";
import { onlyForKnownUsers, transformMsg } from "./decorators";
import { Content, DialogKey, Difficulty, HourFormat, Lang, TimeShifting } from "../constants";
import { computeTimeOffsetBasedOnInput, computeTimezoneShift, mssToTime } from "../lib_helpers/luxon";
import { difficultyNameByLevel, getDifficultyLevels } from "../helpers";
import { UsersRepo } from "../db";
import logger from "../logger";
import { IGNORE_TIME } from "./constants";
import { PlainUser } from "../global";
import { daysToString } from "../lib_helpers/humanize-duration";
import { smokingButtonByIdempotencyKey } from "../helpers/idempotency";

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
    if (msg.user.difficulty === Difficulty.MEDIUM) {
      await UsersRepo.updateUser(msg, { difficulty: Difficulty.HARD });
      await this._res(msg.user, Content.DIFFICULTY_HARD_AUTO);
      return this.onSettingsDone(msg, { isIgnoreHint: true, isConfirm: true });
    }
    const difficulty = difficultyNameByLevel(msg.user.difficulty, msg.user.lang);
    const levels = getDifficultyLevels(msg.user.lang);
    await this._res(msg.user, Content.DIFFICULTY, { difficulty, ...levels }, DialogKey.difficulty);
  }

  @transformMsg
  @onlyForKnownUsers
  public async changeLevelHandler(msg: TelegramBot.Message, difficulty: Difficulty) {
    if (difficulty === Difficulty.DOESNT_SET) {
      logger.error("User try to select Difficulty.DOESNT_SET");
      return;
    }
    await UsersRepo.updateUser(msg, { difficulty });
    if (difficulty !== Difficulty.EASY) {
      const difficultyName = difficultyNameByLevel(difficulty, msg.user.lang);
      await this._res(msg.user, Content.DIFFICULTY_SELECTED, { difficulty: difficultyName });
    }
    return this.onSettingsDone(msg, { isIgnoreHint: true, isConfirm: true });
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

  private async localTimeDialog(ts: number, user: PlainUser) {
    const local_time = mssToTime(ts, user);
    await this._res(user, Content.LOCAL_TIME, { local_time }, DialogKey.local_time);
  }

  @transformMsg
  @onlyForKnownUsers
  public async localTimeDialogCall(msg: TelegramBot.Message) {
    await this.localTimeDialog(msg.ts, msg.user);
  }

  @transformMsg
  @onlyForKnownUsers
  public async makeATimeShift(msg: TelegramBot.Message, timeShift: TimeShifting) {
    try {
      const shift = {
        [TimeShifting.Plus_1H]: 10,
        [TimeShifting.Minus_1H]: -10,
        [TimeShifting.Plus_30Min]: 5,
        [TimeShifting.Minus_30Min]: -5,
      }[timeShift] as -5 | 5 | -10 | 10;
      if (!shift) {
        await this._res(msg.user, Content.ERROR);
        return;
      }
      const timezone = computeTimezoneShift(msg, shift);
      await UsersRepo.updateUser(msg, { timezone });
      await this.localTimeDialog(msg.ts, { ...msg.user, timezone });
    } catch (error) {
      await this._res(msg.user, Content.ERROR, { error });
    }
  }

  @transformMsg
  @onlyForKnownUsers
  public async editATimeFormat(msg: TelegramBot.Message, hourFormat: HourFormat) {
    await UsersRepo.updateUser(msg, { hourFormat });
    await this.localTimeDialog(msg.ts, { ...msg.user, hourFormat });
  }

  @transformMsg
  @onlyForKnownUsers
  public async localTimeConfirmation(msg: TelegramBot.Message, isConfirm?: boolean) {
    if (msg.user.difficulty) {
      return this.onSettingsDone(msg, { isConfirm });
    }
    await UsersRepo.updateUser(msg, { difficulty: Difficulty.EASY });
    await this._res(msg.user, Content.DIFFICULTY_DESCRIPTION);
    const oneMinute = 60 * 1000;
    setTimeout(() => {
      this.onSettingsDone(msg);
    }, oneMinute);
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
    if (!/^([0-1]?\d|2[0-3]):[0-5]\d$/.test(msg.text!.trim())) {
      return;
    }
    try {
      const timezone = computeTimeOffsetBasedOnInput(msg);
      await UsersRepo.updateUser(msg, { timezone });
      const local_time = DateTime.utc().setZone(timezone).toFormat(HourFormat.H24);
      await this._res(msg.user, Content.LOCAL_TIME, { local_time }, DialogKey.local_time);
    } catch (error) {
      logger.debug("Save timezone error", error);
      await this._res(msg.user, Content.TIMEZONE_INVALID);
      return Promise.resolve();
    }
  }

  /**
   * When everything is set up
   * @private
   */
  private async onSettingsDone(
    msg: TelegramBot.Message,
    options?: {
      isConfirm?: boolean;
      isIgnoreHint?: boolean;
    },
  ) {
    const { isConfirm, isIgnoreHint } = options || {};
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
      await this._res(msg.user, Content.STAGE_2_INITIAL);
      await this._res(msg.user, Content.NEXT_SMOKING_TIME, { time_to_get_smoke }, smokingButtonByIdempotencyKey(msg.user.idempotencyKey) );
      return;
    }

    // penalty and win strike section
    const DAYS_TO_CHANGE_DIFFICULTY = 3;
    const isEasyDifficulty = msg.user.difficulty === Difficulty.EASY;
    const isPenaltyState = msg.user.penaltyDays >= DAYS_TO_CHANGE_DIFFICULTY;
    if (!isIgnoreHint && !isEasyDifficulty && isPenaltyState) {
      await this._res(msg.user, Content.PENALTY_3, {}, DialogKey.difficulty_easy);
      return;
    }
    if (isEasyDifficulty && isPenaltyState) {
      await this._res(msg.user, Content.WINSTRIKE_BASE_FAILED);
    }
    const isWinstrike = !isPenaltyState && msg.user.winstrike >= DAYS_TO_CHANGE_DIFFICULTY;
    if (isWinstrike && !isIgnoreHint) {
      const winstrikeDays = daysToString(msg.user.winstrike, msg.user.lang);
      await this._res(msg.user, Content.WINSTRIKE, { winstrike: winstrikeDays });
    }
    const shouldOfferUpLevelForMedium = msg.user.difficulty === Difficulty.MEDIUM
      && msg.user.winstrike % DAYS_TO_CHANGE_DIFFICULTY ===0;
    const shouldOfferLevelUp = isEasyDifficulty || shouldOfferUpLevelForMedium;
    if (shouldOfferLevelUp && !isIgnoreHint && isWinstrike) {
      await this._res(msg.user, Content.WINSTRIKE_BASE_SUCCESS, {}, DialogKey.change_level);
      return;
    }
    const isWinstrikeMessageToDisplay = !isIgnoreHint && !isWinstrike && msg.user.winstrike;
    if (isEasyDifficulty && isWinstrikeMessageToDisplay) {
      const props = { day: msg.user.winstrike, of_days: DAYS_TO_CHANGE_DIFFICULTY };
      await this._res(msg.user, Content.WINSTRIKE_BASE, props);
    }
    if (msg.user.difficulty === Difficulty.MEDIUM && isWinstrikeMessageToDisplay) {
      const props = { day: msg.user.winstrike, of_days: DAYS_TO_CHANGE_DIFFICULTY };
      await this._res(msg.user, Content.WINSTRIKE_MEDIUM, props);
    }

    const smokingButtonKey = smokingButtonByIdempotencyKey(msg.user.idempotencyKey);
    // stage 2 user without next time
    if (!msg.user.nextTime) {
      await this._res(msg.user, Content.SETTINGS_UPDATED_ON_IDLE, {}, smokingButtonKey);
      return;
    }
    // stage 2 normal
    const time_to_get_smoke = mssToTime(msg.user.nextTime, msg.user);
    if (isConfirm) {
      await this._res(msg.user, Content.STAGE_2_HINT);
    } else {
      await this._res(msg.user, Content.SETTINGS_UPDATED);
    }
    await this._res(msg.user, Content.NEXT_SMOKING_TIME, { time_to_get_smoke }, smokingButtonKey);
  }

  @transformMsg
  @onlyForKnownUsers
  public onIgnoreChangesGuide(msg: TelegramBot.Message) {
    return this.onSettingsDone(msg, { isIgnoreHint: true, isConfirm: true });
  }
}