import { Message } from "node-telegram-bot-api";
import logger from "../logger";
import { UsersRepo } from "../db";
import { applyLang } from "../lib_helpers/i18n";
import { Actions } from "./actions";
import { DevActions } from "./development";

export function transformMsg(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(msg: Message, ...args: unknown[]) {
    if (!msg.from || !msg.chat || !msg.message_id || !msg.date) {
      logger.error("Invalid message", msg);
      return Promise.resolve();
    }
    const user = await UsersRepo.getByChatId(msg.chat.id);
    if (user) {
      applyLang(user.lang);
      msg.user = Object.assign({}, user);
      msg.ts = Date.now();
    }
    return originalMethod.apply(this, [msg, ...args]);
  };
  return descriptor;
}

export function onlyForKnownUsers(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(this: Actions, msg: Message, ...args: unknown[]) {
    if (!msg.user) {
      return this.onUserUnknown.apply(this, [msg]);
    }
    return originalMethod.apply(this, [msg, ...args]);
  };
  return descriptor;
}

export function devModeOnly(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (this: DevActions, msg: Message, ...args: unknown[]) {
    if (`${process.env.DEV_MODE}` !== "true") {
      return this.devModeDisabled.apply(this, [msg]);
    }
    return originalMethod.apply(this, [msg, ...args]);
  };
  return descriptor;
}
