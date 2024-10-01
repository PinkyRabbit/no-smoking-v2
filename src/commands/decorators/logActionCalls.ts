import { Message } from "node-telegram-bot-api";
import logger from "../../logger";
import { Actions } from "../actions";

/**
 * Class decorator to log all action calls
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LogActionCalls<T extends new (...args: any[]) => Actions>(constructor: T) {
  return class extends constructor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);

      const methods = Object.getOwnPropertyNames(constructor.prototype)
        .filter(name => typeof this[name as keyof this] === "function" && name !== "constructor" && !/_/.test(name));

      // Replace each method with a wrapped version that logs the call
      for (const methodName of methods) {
        const originalMethod = this[methodName as keyof this];
        if (typeof originalMethod === "function") {
          this[methodName as keyof Actions] = function(this: Actions, msg: Message, ...args: unknown[]) {
            const argsStr = (args || []).map(arg => JSON.stringify(arg)).join(", ");
            logger.info(`U-${msg.chat.id} ${methodName} ${argsStr}`);
            return originalMethod.apply(this, [msg, ...args]);
          };
        }
      }
    }
  };
}
