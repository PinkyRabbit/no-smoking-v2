import monk  from "monk";
import logger from "../../logger";
import { RequestOptions } from "../dbOptionsConstructor";
import { Difficulty, Lang } from "../../constants";
import { logWithTimestamps } from "../../lib_helpers/logger";
import { tsToDateTime } from "../../lib_helpers/luxon";

export type User = {
  /**
   * @property chatId - Telegram chat id
   * @type number
   * id of the user in Telegram
   */
  chatId: number;
  /**
   * @property lang - language code
   * @type Lang
   * @default Lang.en
   * Telegram has own language codes, we have a tgLangCodeToLang mapper
   * to convert it to our Lang enum
   */
  lang: Lang;
  /**
   * @property timezone - timezone UTC string
   * @type string | null
   * @default null
   * Provided by user, because telegram stores dates in UTC+0
   */
  timezone: string | null;
  /**
   * @property minDeltaTimesInitial - array of delta times from Stage 1
   * Is using to calculate initial value for Stage 2 of the new user.
   * @type number[] - milliseconds
   * Stage 1: array of delta times
   * Stage 2: [] - empty array
   */
  minDeltaTimesInitial: number[];
  /**
   * @property minDeltaTime - minimal delta time.
   * Is using to know lower limit for penalties.
   * Also, this is initial value for Stage 2 of the new user.
   * @type number - minutes
   * @default 0
   * Stage 1: 0
   * Stage 2: value as arithmetic mean of minDeltaTimesInitial
   */
  minDeltaTime: number;
  /**
   * @property deltaTime - current delta time.
   * @type number - minutes
   * @default 0
   * Stage 1: 0
   * Stage 2: more or equal to minDeltaTime
   */
  deltaTime: number;
  /**
   * @property lastTime - timestamp of the last smoking time
   * @type number - timestamp Server
   * @default 0
   */
  lastTime: number;
  /**
   * @property nextTime - marker for timer-operations
   * @type number - timestamp Server
   * 0 - default value. Not set (Sage 1) or Smoking Time passed (Sage 2)
   * more than 0 - timestamp Server. Value to check in timer-operations
   */
  nextTime: number;
  /**
   * @property difficulty - type of difficulty level
   * @type Difficulty - enum
   * Reflects on deltaTime calculation on each Big Interval
   */
  difficulty: Difficulty | null;
  /**
   * @property penalty - count of penalties
   * @type number
   * Reflects on deltaTime calculation on each Big Interval
   * Refreshes on each Big Interval
   */
  penalty: number;
  /**
   * @property startDate - to know the day when user starts the journey
   * @type Date
   */
  startDate: Date;
  /**
   * @property endDate - to know when user quite of smoking
   * @type Date | null
   */
  endDate: Date | null;
};

export class UsersRepo extends RequestOptions {
  public readonly Users = monk(this.connectionString, this.options).get<User>("users");

  static getByChatId(chatId: number) {
    const that = new UsersRepo();
    return that.Users.findOne({ chatId });
  }

  static addNewUser(chatId: number, lang: Lang) {
    const that = new UsersRepo();
    const defaultUser: User = {
      chatId,
      lang,
      timezone: null,
      difficulty: null,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
      deltaTime: 0,
      lastTime: 0,
      nextTime: 0,
      penalty: 0,
      startDate: new Date(),
      endDate: null,
    };
    return that.Users.insert(defaultUser);
  }

  static updateUser(chatId: number, update: Partial<User>) {
    logWithTimestamps(`U-${chatId} [update]`, update);
    const that = new UsersRepo();
    return that.Users.update({ chatId }, { $set: update });
  }

  static removeUser(chatId: number) {
    logger.debug(`U-${chatId} [delete]`);
    const that = new UsersRepo();
    return that.Users.remove({ chatId });
  }

  /**
   * Method returns all users who reached their targeted time
   */
  static async getAllSmokersToSmoke(): Promise<User[]> {
    const that = new UsersRepo();
    const ts = Date.now();
    const users = await that.Users.find({
      $and: [
        { endDate: { $eq: null } },
        { nextTime: { $ne: 0 } },
        { nextTime: { $lte: ts } },
      ]
    });
    const userIds = users.map(({ _id }) => _id);
    const chatIds = users.map(({ chatId }) => chatId);
    const dateTimeString = tsToDateTime(ts);
    logger.info(`[${dateTimeString}] smokingTimeTest call, ${chatIds.length} affected`);
    await that.Users.update({ _id: { $in: userIds } }, { $set: { nextTime: 0 } });
    return users;
  }
}