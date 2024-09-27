import TelegramBot from "node-telegram-bot-api";
import { I18n } from "i18n";
import { join as pathJoin } from "path";
import { BTN, Callback, DialogKey } from "./keys";
import lang from "./locales";

export const i18n = new I18n({
  locales: ["en", "ru"],
  directory: pathJoin(__dirname, "/locales"),
  defaultLocale: "ru",
  extension: ".ts",
  updateFiles: false,
  syncFiles: false,
});
const catalog = i18n.getCatalog();
catalog.ru = lang.ru;
catalog.en = lang.en;

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
  return [];
};

export const buttonsFor = (key: DialogKey): TelegramBot.SendMessageOptions => {
  const inline_keyboard = selectButtonsByKey(key);
  return { reply_markup: { inline_keyboard } };
};

export { DialogKey };