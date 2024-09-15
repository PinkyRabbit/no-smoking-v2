import monk  from "monk";
import { RequestOptions } from "../dbOptionsConstructor";

export type User = {
  chatId: number;
  isStage1: boolean;
  deltaTime: number; // delta time in minutes
  deltaStage1: number[]; // delta time in minutes for Stage 1
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
    const defaultUser: User = { chatId, prevTime: msgTime, isStage1: true, deltaTime: 0, deltaStage1: [], };
    return that.Users.insert(defaultUser);
  }

  static updateUser(chatId: number, update: Partial<User>) {
    const that = new UsersRepo();
    return that.Users.update({ chatId }, { $set: update });
  }
}