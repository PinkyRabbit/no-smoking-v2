import { Actions } from "../actions";
import { Message } from "node-telegram-bot-api";

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
