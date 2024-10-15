import { Actions } from "../actions";
import { Message } from "node-telegram-bot-api";

export function stage2(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(this: Actions, msg: Message, ...args: unknown[]) {
    const { minDeltaTime, deltaTime, timezone, difficulty } = msg.user;
    if (!minDeltaTime || !deltaTime || !timezone || !difficulty) {
      return this.stage2Protected.apply(this, [msg]);
    }
    return originalMethod.apply(this, [msg, ...args]);
  };
  return descriptor;
}
