import monk, { IMonkManager, ICollection } from "monk";
import { Message } from "node-telegram-bot-api";
import logger from "../../logger";
import { RequestOptions } from "../dbOptionsConstructor";
import { Difficulty, Lang } from "../../constants";
import { logWithTimestamps } from "../../lib_helpers/logger";
import { dateNow, gmtToUtc, isValidTimeZoneCheck, tsToDateTime } from "../../lib_helpers/luxon";

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
   * @type string | undefined
   * @default undefined
   * @default undefined
   * Computed, based on value, provided by user
   */
  timezone: string | undefined;
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
   * @property ignoreTime - marker to identify a user who has stopped using the bot
   * @type number - timestamp Server
   * 0 - default value
   */
  ignoreTime: number;
  /**
   * @property difficulty - type of difficulty level
   * @type Difficulty - enum
   * 0 - default value
   * Reflects on deltaTime calculation on each Big Interval
   */
  difficulty: Difficulty;
  /**
   * @property penalty - point, count of penalties
   * @type number
   * Reflects on deltaTime calculation on each Big Interval
   * Refreshes on each Big Interval
   */
  penalty: number;
  /**
   * @property penaltyAll - minutes, sum of all penalties
   * @type number
   */
  penaltyAll: number;
  /**
   * @property penaltyDays - days, number of consecutive days
   * @type number
   */
  penaltyDays: number;
  /**
   * @property motivizerIndex - index of motivizer
   * @type number
   */
  motivizerIndex: number;
  /**
   * @property cigarettesInDay - number of cigarettes smoked last day
   * @type number
   */
  cigarettesInDay: number;
  /**
   * @property cigarettesSummary - number of cigarettes smoked summary
   * @type number
   */
  cigarettesSummary: number;
  /**
   * @property startDate - to know the day when user starts the journey
   * @type Date
   */
  startDate: Date;
};

export class UsersRepo extends RequestOptions {
  private static instance: UsersRepo | null = null;
  public static db: IMonkManager | null = null;

  constructor() {
    super();
    if (!UsersRepo.instance) {
      UsersRepo.db = monk(this.connectionString, this.options);
      UsersRepo.instance = this;
      return this;
    }
    return UsersRepo.instance;
  }

  public static get call(): ICollection<User> {
    if (!UsersRepo.instance) {
      UsersRepo.instance = new UsersRepo();
    }
    if (!UsersRepo.db) {
      throw new Error("Database connection not initialized");
    }
    return UsersRepo.db.get<User>("users");
  }

  static async closeConnection(): Promise<void> {
    if (!UsersRepo.db) {
      return;
    }
    try {
      await UsersRepo.db.close();
      UsersRepo.instance = null;
      UsersRepo.db = null;
      logger.info("DB connection closed");
    } catch(e) {
      logger.error(e);
    }
  }

  static getByChatId(chatId: number) {
    return UsersRepo.call.findOne({ chatId });
  }

  static addNewUser(chatId: number, lang: Lang) {
    const defaultUser: User = {
      chatId,
      lang,
      timezone: undefined,
      difficulty: Difficulty.DOESNT_SET,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
      deltaTime: 0,
      lastTime: 0,
      nextTime: 0,
      ignoreTime: 0,
      penalty: 0,
      penaltyAll: 0,
      penaltyDays: 0,
      motivizerIndex: 0,
      cigarettesInDay: 0,
      cigarettesSummary: 0,
      startDate: new Date(),
    };
    return UsersRepo.call.insert(defaultUser);
  }

  static async updateUser(msg: Message, update: Partial<User>) {
    const chatId = msg.user.chatId;
    logWithTimestamps(`U-${chatId} [update]`, update);
    await UsersRepo.call.update({ chatId }, { $set: update });
    Object.entries(update).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      msg.user[key] = value;
    });
  }

  static async setTimezone(msg: Message, timezone: string) {
    const isValidTimezone = isValidTimeZoneCheck(timezone);
    if (isValidTimezone) {
      const update: Partial<User> = { timezone };
      await UsersRepo.updateUser(msg, update);
      return timezone;
    }
    const gmtFormatValue = gmtToUtc(timezone);
    const update: Partial<User> = { timezone: gmtFormatValue };
    await UsersRepo.updateUser(msg, update);
    return gmtFormatValue;
  }

  static removeUser(chatId: number) {
    logger.debug(`U-${chatId} [delete]`);
    return UsersRepo.call.remove({ chatId });
  }

  /**
   * Method returns all users who reached their targeted time
   */
  static async getAllSmokersToSmoke(): Promise<User[]> {
    const ts = dateNow();
    const users = await UsersRepo.call.find({
      $and: [
        { nextTime: { $ne: 0 } },
        { nextTime: { $lte: ts } },
      ]
    });
    const userIds = users.map(({ _id }) => _id);
    const chatIds = users.map(({ chatId }) => chatId);
    const dateTimeString = tsToDateTime(ts);
    logger.info(`[${dateTimeString}] smokingTimeTest call, ${chatIds.length} affected`);
    await UsersRepo.call.update({ _id: { $in: userIds } }, { $set: { nextTime: 0 } });
    return users;
  }

  /**
   * Method returns all users who reached their targeted time
   */
  static async getAllIgnoringBot(): Promise<User[]> {
    const ts = dateNow();
    const users = await UsersRepo.call.find({
      $and: [
        { ignoreTime: { $ne: 0 } },
        { ignoreTime: { $lte: ts } },
      ]
    });
    const userIds = users.map(({ _id }) => _id);
    const chatIds = users.map(({ chatId }) => chatId);
    const dateTimeString = tsToDateTime(ts);
    logger.info(`[${dateTimeString}] ignoringBot call, ${chatIds.length} affected`);
    await UsersRepo.call.update({ _id: { $in: userIds } }, { $set: { ignoreTime: 0 } });
    return users;
  }
}