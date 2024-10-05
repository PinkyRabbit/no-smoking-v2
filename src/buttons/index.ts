import TelegramBot from "node-telegram-bot-api";
import { I18n } from "i18n";
import { join as pathJoin } from "path";
import { BTN, Callback, DialogKey } from "./keys";
import lang from "./locales";
import { Lang } from "../constants";

export const i18n = new I18n({
  locales: [Lang.RU, Lang.EN],
  directory: pathJoin(__dirname, "/locales"),
  defaultLocale: Lang.EN,
  extension: ".ts",
  updateFiles: false,
  syncFiles: false,
});
const catalog = i18n.getCatalog();
catalog[Lang.RU] = lang[Lang.RU];
catalog[Lang.EN] = lang[Lang.EN];

type ButtonOption = { text: string; callback_data: Callback };
type ButtonLine = ButtonOption[];
type InlineKeyboard = ButtonLine[];

const selectButtonsByKey = (key: DialogKey): InlineKeyboard => {
  if (key === DialogKey.to_start) {
    const text = i18n.__(BTN.CallStart);
    const btn = { text, callback_data: Callback.start };
    return [[btn]];
  }
  if (key === DialogKey.beginning) {
    const text = i18n.__(BTN.Beginning);
    const btn = { text, callback_data: Callback.beginning };
    return [[btn]];
  }
  if (key === DialogKey.lang) {
    return [[
      { text: i18n.__(BTN.Lang_RU), callback_data: Callback.lang_ru },
      { text: i18n.__(BTN.Lang_EN), callback_data: Callback.lang_en },
    ]];
  }
  if (key === DialogKey.im_smoking) {
    const text = i18n.__(BTN.Im_Smoking);
    const btn = { text, callback_data: Callback.im_smoking };
    return [[btn]];
  }
  if (key === DialogKey.start_existing) {
    return [
      [{ text: i18n.__(BTN.Reset_Ignore), callback_data: Callback.reset_ignore }],
      [{ text: i18n.__(BTN.Reset_Stage_2), callback_data: Callback.reset_to_stage_2 }],
      [{ text: i18n.__(BTN.Reset_Stage_1), callback_data: Callback.reset_to_stage_1 }],
    ];
  }
  if (key === DialogKey.dev) {
    return [
      [
        { text: i18n.__(BTN.Dev_Delete_User), callback_data: Callback.Dev_Delete_User },
        { text: i18n.__(BTN.Dev_To_Stage_1), callback_data: Callback.Dev_To_Stage_1 }
      ],
      [
        { text: i18n.__(BTN.Dev_Fill_Stage_1), callback_data: Callback.Dev_Fill_Stage_1 },
        { text: i18n.__(BTN.Dev_Stage_1_More_Max), callback_data: Callback.Dev_Stage_1_More_Max }
      ],
      [
        { text: i18n.__(BTN.Dev_Last_Time_1_Hour), callback_data: Callback.Dev_Last_Time_1_Hour },
        { text: i18n.__(BTN.Dev_To_Idle), callback_data: Callback.Dev_To_Idle },
      ],
    ];
  }
  return [];
};

export const buttonsFor = (key: DialogKey): TelegramBot.SendMessageOptions => {
  const inline_keyboard = selectButtonsByKey(key);
  return { reply_markup: { inline_keyboard } };
};

export { DialogKey };