import { BTN } from "../../constants";
import { ButtonNames } from "../types";

export const buttonsRu: ButtonNames  = {
  [BTN.CallStart]: "/start",
  [BTN.Beginning]: "Начинаем!",
  [BTN.Im_Smoking]: "Я сейчас курю 🚬",
  [BTN.Reset_Stage_1]: "Сбросить всё 👍",
  [BTN.Reset_Stage_2]: "Сбросить до Этапа 2 🐯",
  [BTN.Reset_Ignore]: "Оставить \"как есть\" ❌️",
  [BTN.Level_Easy]: "Тренировочный режим 📚",
  [BTN.Level_Medium]: "Обычный 👍",
  [BTN.Level_Hard]: "Продвинутый 👑",
  [BTN.Ignore_Success]: "Я бросил!",
  [BTN.Ignore_Failed]: "Не буду бросать 👎",
  [BTN.Ignore_Busy]: "Просто продолжим ▶️",
  [BTN.Ignore_Penalty_10]: "Штраф 10 минут 🚀",
  [BTN.Timezone_Correct_H12]: "PLACEHOLDER", // @see {import('@/commands/settings').Settings#onMessage}
  [BTN.Timezone_Correct_H24]: "PLACEHOLDER", // @see {import('@/commands/settings').Settings#onMessage}
  [BTN.Timezone_Incorrect]: "Неверно 🔄",
  [BTN.Recommendations]: "Советы, как бросить курить",
  [BTN.Lang_RU]: "RU 🇷🇺",
  [BTN.Lang_EN]: "EN 🇬🇧",
  [BTN.Dev_Content_RU]: "RU 🇷🇺",
  [BTN.Dev_Content_EN]: "EN 🇬🇧",
  [BTN.Dev_Delete_User]: "Удалить пользователя 🗑️",
  [BTN.Dev_To_Stage_1]: "Сбросить до Stage 1 🗯️",
  [BTN.Dev_Fill_Stage_1]: "Заполнить Stage 1 📈",
  [BTN.Dev_Last_Time_1_Hour]: "Last Time на 1 час назад 🕘",
  [BTN.Dev_Stage_1_More_Max]: "Stage 1 больше макс 🕧",
  [BTN.Dev_To_Idle]: "To idle mode 💤",
  [BTN.Dev_To_Idle_Empty]: "To idle EMPTY 💤",
  [BTN.Dev_To_Idle_Three_Times]: "To idle 3 💤",
  [BTN.Dev_To_Idle_Max_Limit]: "To idle MAX 💤",
  [BTN.Dev_Next]: "По таймеру ⏰️",
  [BTN.Dev_Motivizer_25]: "Мотивайзер на 25 ⛹️",
  [BTN.Dev_Motivizer_Full]: "Мотивайзер весь ⛹️",
  [BTN.Dev_Ignore]: "В режим Ignore 🌀",
  [BTN.Dev_Content]: "Контент 📋",
  [BTN.Dev_Content_All]: "Весь контент 📋",
};