import monk  from "monk";
import { RequestOptions } from "../dbOptionsConstructor";
import { Lang } from "../../constants";

export type User = {
  chatId: number;
  lang: Lang;
  minDeltaTime: number; // minutes, 0 = stage 1
  minDeltaTimesInitial: number[]; // timestamp Server array
  deltaTime: number; // minutes
  tgLastCallTime: number; // Telegram timestamp
  lastTime: number; // timestamp Server
  nextTime: number; // timestamp Server
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
    const that = new UsersRepo();
    return that.Users.update({ chatId }, { $set: update });
  }

  static removeUser(chatId: number) {
    const that = new UsersRepo();
    return that.Users.remove({ chatId });
  }

  /**
   * Method returns all users who reached their targeted time
   */
  static async getAllSmokersToSmokeChatIds(): Promise<number[]> {
    const that = new UsersRepo();
    const ts = Date.now();
    const users = await that.Users.find({
      $and: [
        { endDate: { $ne: null } },
        { nextTime: { $ne: 0 } },
        { nextTime: { $lte: ts } },
      ]
    });
    const userIds = users.map(({ _id }) => _id);
    const chatIds = users.map(({ chatId }) => chatId);
    await that.Users.update({ _id: { $in: userIds } }, { $set: { nextTime: 0 } });
    return chatIds;
  }
}