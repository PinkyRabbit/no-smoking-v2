import { DevActions } from "../development";
import { Message } from "node-telegram-bot-api";

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
