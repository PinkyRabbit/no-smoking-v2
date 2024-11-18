import { Message } from "node-telegram-bot-api";
import logger from "../../logger";
import { UsersRepo } from "../../db";
import { dateNow } from "../../lib_helpers/luxon";

export function transformMsg(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(msg: Message, ...args: unknown[]) {
    logger.debug(msg); // @FIXME: to remove!
    if (!msg.chat.id) {
      logger.error("Invalid message", msg);
      return;
    }
    msg.ts = dateNow();
    const user = await UsersRepo.getByChatId(msg.chat.id);
    if (user) {
      msg.user = Object.assign({}, user);
    }
    return originalMethod.apply(this, [msg, ...args]);
  };
  return descriptor;
}
