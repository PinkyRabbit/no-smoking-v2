import { CallbackQuery } from "node-telegram-bot-api";
import TgBot from "../telegram-bot";
import logger from "../logger";
import { BotEvent } from "./keys";
import { Callback } from "../buttons/keys";
import { Actions } from "./actions";
import { Lang } from "../constants";

export const botActionsInit = (bot: TgBot) => {
  const act = new Actions(bot);
  bot.on(BotEvent.Message, () => Promise.resolve());
  bot.onText(BotEvent.Start, act.onStart);
  bot.onText(BotEvent.SelectLanguage, act.onLang);
  bot.onText(BotEvent.Dev, act.onDev);
  bot.on(BotEvent.Callback, (callbackQuery: CallbackQuery) => {
    const callbackType = callbackQuery.data as Callback;
    const message = callbackQuery.message;
    if (!message || !callbackType) {
      return;
    }
    switch (callbackType) {
      case Callback.start:
        act.onStart(message);
        break;
      case Callback.beginning:
        act.toStage1(message);
        break;
      case Callback.im_smoking:
        act.imSmokingHandler(message);
        break;
      case Callback.lang_ru:
        act.changeLanguageHandler(message, Lang.RU);
        break;
      case Callback.lang_en:
        act.changeLanguageHandler(message, Lang.EN);
        break;
      case Callback.reset_ignore:
        act.resetIgnoreHandler(message);
        break;
      case Callback.reset_to_stage_1:
        act.resetToStage1Handler(message);
        break;
      case Callback.reset_to_stage_2:
        act.resetToStage2Handler(message);
        break;
      case Callback.Dev_Delete_User:
        act.devOnDel(message);
        break;
      case Callback.Dev_To_Stage_1:
        act.devResetToStage1(message);
        break;
      case Callback.Dev_Fill_Stage_1:
        act.devFillStage1(message);
        break;
      case Callback.Dev_Last_Time_1_Hour:
        act.devLastTimeMinusHour(message);
        break;
      case Callback.Dev_Stage_1_More_Max:
        act.devStage1MoreThanMax(message);
        break;
      case Callback.Dev_To_Idle:
        act.devToIdle(message);
        break;
      case Callback.Dev_Next:
        act.devByTimer(message);
        break;
      default:
        logger.error(`Unsupported callback "${callbackType}"`);
    }
  });
};