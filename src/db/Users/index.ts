import monk  from "monk";
import { RequestOptions } from "../dbOptionsConstructor";

export type User = {
  chatId: number;
  isStage1: boolean;
  initialPeriods: number[];
  prevTime: number;
};

export class UsersRepo extends RequestOptions {
  public readonly Users = monk(this.connectionString, this.options).get<User>("users");

  static getByChatId(chatId: number) {
    const that = new UsersRepo();
    return that.Users.findOne({ chatId });
  }

  static addNewUser(chatId: number, msgTime: number) {
    const that = new UsersRepo();
    return that.Users.insert({ chatId, isStage1: true, initialPeriods: [], prevTime: msgTime });
  }

  static updateUser(chatId: number, update: Partial<User>) {
    const that = new UsersRepo();
    return that.Users.update({ chatId }, { $set: update });
  }
}