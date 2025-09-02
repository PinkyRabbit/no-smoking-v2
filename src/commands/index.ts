import { CallbackQuery } from "node-telegram-bot-api";
import TgBot from "../telegram-bot";
import logger from "../logger";
import { BotEvent } from "./keys";
import { Actions } from "./actions";
import { BTN, Difficulty, HourFormat, Lang, TimeShifting } from "../constants";

export const botActionsInit = (bot: TgBot) => {
  const act = new Actions(bot);
  bot.on(BotEvent.Message, act.onMessage);
  bot.onText(BotEvent.Start, act.onStart);
  bot.onText(BotEvent.Stats, act.onStats);
  bot.onText(BotEvent.SelectLanguage, act.onLang);
  bot.onText(BotEvent.SelectLevel, act.onLevel);
  bot.onText(BotEvent.SelectLocalTime, act.localTimeDialogCall);
  bot.onText(BotEvent.Dev, act.onDev);
  bot.onText(BotEvent.How, act.onHow);
  bot.on(BotEvent.Callback, (callbackQuery: CallbackQuery) => {
    const callbackType = callbackQuery.data as BTN;
    const message = callbackQuery.message;
    if (!message || !callbackType) {
      return;
    }
    switch (callbackType) {
      case BTN.CallStart:
        act.onStart(message);
        break;
      case BTN.Beginning:
        act.toStage1(message);
        break;
      case BTN.Im_Smoking:
        act.imSmokingHandler(message);
        break;
      case BTN.Lang_RU:
        act.changeLanguageHandler(message, Lang.RU);
        break;
      case BTN.Lang_EN:
        act.changeLanguageHandler(message, Lang.EN);
        break;
      case BTN.Level_Easy:
        act.changeLevelHandler(message, Difficulty.EASY);
        break;
      case BTN.Level_Medium:
        act.changeLevelHandler(message, Difficulty.MEDIUM);
        break;
      case BTN.Level_Hard:
        act.changeLevelHandler(message, Difficulty.HARD);
        break;
      case BTN.Reset_Ignore:
        act.resetIgnoreHandler(message);
        break;
      case BTN.Reset_Stage_1:
        act.resetToStage1Handler(message);
        break;
      case BTN.Reset_Stage_2:
        act.resetToStage2Handler(message);
        break;
      case BTN.Ignore_Busy:
        act.ignoreBusy(message);
        break;
      case BTN.Ignore_Penalty_10:
        act.ignorePenalty10(message);
        break;
      case BTN.Ignore_Failed:
        act.ignoreFailed(message);
        break;
      case BTN.Ignore_Success:
      case BTN.Recommendations:
        act.ignoreSuccess(message);
        break;
      case BTN.Timezone_Correct_H12:
        act.timezoneCorrect(message, HourFormat.H12);
        break;
      case BTN.Timezone_Correct_H24:
        act.timezoneCorrect(message, HourFormat.H24);
        break;
      case BTN.Timezone_Incorrect:
        act.newLocalTime(message);
        break;
      case BTN.Local_Time_Minus_1:
        act.makeATimeShift(message, TimeShifting.Minus_1H);
        break;
      case BTN.Local_Time_Plus_1:
        act.makeATimeShift(message, TimeShifting.Plus_1H);
        break;
      case BTN.Local_Time_Minus_30:
        act.makeATimeShift(message, TimeShifting.Minus_30Min);
        break;
      case BTN.Local_Time_Plus_30:
        act.makeATimeShift(message, TimeShifting.Plus_30Min);
        break;
      case BTN.Local_Time_24h:
        act.editATimeFormat(message, HourFormat.H24);
        break;
      case BTN.Local_Time_AmPm:
        act.editATimeFormat(message, HourFormat.H12);
        break;
      case BTN.Local_Time_Confirmed:
        act.makeATimeShift(message, TimeShifting.Confirmed);
        break;
      case BTN.Dev_Delete_User:
        act.devOnDel(message);
        break;
      case BTN.Dev_To_Stage_1:
        act.devResetToStage1(message);
        break;
      case BTN.Dev_Fill_Stage_1:
        act.devFillStage1(message);
        break;
      case BTN.Dev_Last_Time_1_Hour:
        act.devLastTimeMinusHour(message);
        break;
      case BTN.Dev_Stage_1_More_Max:
        act.devStage1MoreThanMax(message);
        break;
      case BTN.Dev_To_Idle_Empty:
        act.devToIdle(message);
        break;
      case BTN.Dev_To_Idle:
        act.devToIdle(message, false);
        break;
      case BTN.Dev_To_Idle_Three_Times:
        act.devToIdle(message, false, { isThree: true });
        break;
      case BTN.Dev_To_Idle_Max_Limit:
        act.devToIdle(message, false, { isMax: true });
        break;
      case BTN.Dev_Next:
        act.devByTimer(message);
        break;
      case BTN.Dev_Motivizer_25:
        act.devMotivizer(message, 25);
        break;
      case BTN.Dev_Motivizer_Full:
        act.devMotivizer(message);
        break;
      case BTN.Dev_Ignore:
        act.devIgnore(message);
        break;
      case BTN.Dev_Content:
        act.devContent(message);
        break;
      case BTN.Dev_Content_All:
        act.devAllContent(message);
        break;
      case BTN.Dev_Content_RU:
        act.devAllContentRecursive(message, Lang.RU);
        break;
      case BTN.Dev_Content_EN:
        act.devAllContentRecursive(message, Lang.EN);
        break;
      default:
        logger.error(`Unsupported callback "${callbackType}"`);
    }
  });
};