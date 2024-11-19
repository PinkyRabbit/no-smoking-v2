import TelegramBot from "node-telegram-bot-api";
import logger from "./logger";
import { User, UsersRepo } from "./db";
import { ContentProps, getContent, getButtons } from "./content";
import { Content, DialogKey } from "./constants";

/**
 * Custom telegram bot class extend normal send message logic
 * @extends TelegramBot
 * @param token - bot token
 */
class TgBot extends TelegramBot {
  constructor(token: string) {
    const polling = {
      autoStart: true,
      params: {
        timeout: 30
      },
    };
    const options = { polling,  onlyFirstMatch: true };
    super(token, options);
    this.setupErrorHandling();
    this.setupShutdownHandlers();
  }

  private setupShutdownHandlers(): void {
    process.on("SIGINT", () => this.handleShutdown("SIGINT"));
    process.on("SIGTERM", () => this.handleShutdown("SIGTERM"));
  }

  private setupErrorHandling(): void {
    this.on("polling_error", (error: Error) => {
      logger.error("Polling error:", error);
    });
  }

  private handleShutdown(signal: string): void {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    this.stopPolling();
    UsersRepo.closeConnection();
    process.exit(0);
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
