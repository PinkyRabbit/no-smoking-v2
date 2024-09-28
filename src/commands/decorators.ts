import { Message } from "node-telegram-bot-api";
import { UsersRepo } from "../db";
import { applyLang } from "../lib_helpers/i18n";
import { Actions } from "./actions";
import { DevActions } from "./development";

const transformMessage = async (msg: Message) => {
  const user = await UsersRepo.getByChatId(msg.chat.id);
  if (user) {
    applyLang(user.lang);
    msg.user = Object.assign({}, user);
  }
  return msg;
};

export function transformMsg(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(...args: unknown[]) {
    // Find the index of the 'msg' parameter
    const msgIndex = originalMethod.toString()
      .match(/\(([^)]*)\)/)[1]
      .split(",")
      .findIndex((param: string) => param.trim() === "msg");

    if (msgIndex !== -1) {
      // Transform the msg argument
      args[msgIndex] = await transformMessage(args[msgIndex] as Message);
    }

    return originalMethod.apply(this, args);
  };
  return descriptor;
}

export function onlyForKnownUsers(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(this: Actions, ...args: unknown[]) {
    const msgIndex = originalMethod.toString()
      .match(/\(([^)]*)\)/)[1]
      .split(",")
      .findIndex((param: string) => param.trim() === "msg");

    if (msgIndex === -1) {
      return originalMethod.apply(this, args);
    }
    const msg = args[msgIndex] as Message;
    if (!msg.user) {
      return this.onUserUnknown.apply(this, args as [msg: Message]);
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

export function devModeOnly(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: DevActions, ...args: unknown[]) {
    if (`${process.env.DEV_MODE}` !== "true") {
      return this.devModeDisabled.apply(this, args as [msg: Message]);
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}
