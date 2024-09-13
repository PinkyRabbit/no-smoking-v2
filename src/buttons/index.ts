import { I18n } from 'i18n';
import { join as pathJoin } from 'path';
import { BTN, Callback, DialogKey } from "./keys";
import lang from './locales';

const i18n = new I18n({
  locales: ['en', 'ru'],
  directory: pathJoin(__dirname, '/locales'),
  defaultLocale: 'ru',
  extension: '.ts',
  updateFiles: false,
  syncFiles: false,
});
const catalog = i18n.getCatalog();
catalog.ru = lang.ru;
catalog.en = lang.en;

type ButtonOption = { text: string; callback_data: Callback };
type ButtonLine = ButtonOption[];
type InlineKeyboard = ButtonLine[];
type ReplyMarkup = { inline_keyboard: InlineKeyboard };
type GetButtonsResult = { reply_markup: ReplyMarkup };

const selectButtonsByKey = (key: DialogKey): InlineKeyboard => {
  const result: InlineKeyboard = [];
  switch (key) {
    case DialogKey.beginning:
      const text = i18n.__(BTN.Beginning);
      const btn = { text, callback_data: Callback.beginning };
      result.push([btn]);
      break;
    default:
      return [];
  }
  return result;
};

export const buttonsFor = (key: DialogKey): GetButtonsResult => {
  const inline_keyboard = selectButtonsByKey(key);
  return { reply_markup: { inline_keyboard } };
};

export { DialogKey };