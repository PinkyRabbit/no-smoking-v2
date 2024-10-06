import TelegramBot from "node-telegram-bot-api";
import { User } from "./db";
import { ContentProps, getContent } from "./content";
import { getButtons } from "./buttons";
import { Content, DialogKey } from "./constants";

/**
 * Custom telegram bot class extend normal send message logic
 * @extends TelegramBot
 * @param token - bot token
 * @param options - bot options
 */
class TgBot extends TelegramBot {
  constructor(token: string, options?: TelegramBot.ConstructorOptions) {
    super(token, options);
  }

  public sendToUser(user: User, contentKey: Content, contentProps: ContentProps = {}, dialogKey?: DialogKey) {
    const content = getContent(user.lang, contentKey, contentProps);
    const options: TelegramBot.SendMessageOptions = { parse_mode: "Markdown" };
    if (dialogKey) {
      const buttons = getButtons(user.lang, dialogKey);
      options.reply_markup = buttons.reply_markup;
    }
    return this.sendMessage(user.chatId, content, options);
  };
}

export default TgBot;
