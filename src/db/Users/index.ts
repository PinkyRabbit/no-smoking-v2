import monk  from "monk";
import logger from "../../logger";
import { RequestOptions } from "../dbOptionsConstructor";
import { Lang } from "../../constants";
import { logWithTimestamps } from "../../lib_helpers/logger";
import { tsToDateTime } from "../../lib_helpers/luxon";

export type User = {
  chatId: number;
  lang: Lang;
  minDeltaTime: number; // minutes, 0 = stage 1
  minDeltaTimesInitial: number[]; // timestamp Server array
  deltaTime: number; // minutes
  tgLastCallTime: number; // Telegram timestamp
  lastTime: number; // timestamp Server
  /**
   * @property nextTime - marker for timer-operations
   * @type number - timestamp Server
   * 0 - default value. Not set (Sage 1) or Smoking Time passed (Sage 2)
   * more than 0 - timestamp Server. Value to check in timer-operations
   */
  nextTime: number;
  penalty: number;
  startDate: Date | null; // date of stage 1 start
  endDate: Date | null; // date of stage 2 end
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
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
      deltaTime: 0,
      tgLastCallTime: 0,
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