import monk  from "monk";
import { RequestOptions } from "../dbOptionsConstructor";
import { Lang } from "../../commands/constants";

/**
 * All the time is stored in minutes
 */

export type User = {
  chatId: number;
  lang: Lang;
  minDeltaTime: number; // 0 = stage 1
  minDeltaTimesInitial: number[]; // delta time for initial stage
  deltaTime: number;
  prevTime: number; // for stage 1
  nextTime: number; // for stage 2
  startDate: Date | null; // date of stage 1 start
  endDate: Date | null; // date of stage 2 end
};

export class UsersRepo extends RequestOptions {
  public readonly Users = monk(this.connectionString, this.options).get<User>("users");

  static getByChatId(chatId: number) {
    const that = new UsersRepo();
    return that.Users.findOne({ chatId });
  }

  static addNewUser(chatId: number, lang = Lang.EN) {
    const that = new UsersRepo();
    const defaultUser: User = {
      chatId,
      lang,
      minDeltaTime: 0,
      minDeltaTimesInitial: [],
      deltaTime: 0,
      prevTime: 0,
      nextTime: 0,
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
}