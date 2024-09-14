import monk from "monk";
import { RequestOptions } from "../dbOptionsConstructor";

export class Users extends RequestOptions {
  public readonly User = monk(this.connectionString, this.options).get("users");

  static getByChatId(chatId: number) {
    const that = new Users();
    return that.User.findOne({ chatId });
  }
}