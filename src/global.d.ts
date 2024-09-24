import { Message as TelegramMessage } from "node-telegram-bot-api";
import { IObjectID } from "monk";
import { User } from "./db";

type PlainUser = { _id: IObjectID; } & User

declare module "node-telegram-bot-api" {
  interface Message extends TelegramMessage {
    user: PlainUser
  }
}