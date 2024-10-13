import { SendMessageOptions } from "node-telegram-bot-api";
import { I18n } from "i18n";
import { join as pathJoin } from "path";
import { BTN, Callback } from "./keys";
import lang from "./locales";
import { Lang, DialogKey } from "../constants";

const i18n = new I18n({
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

const selectButtonsByKey = (key: DialogKey, locale: Lang): InlineKeyboard => {
  if (key === DialogKey.to_start) {
    const text = i18n.__({ phrase: BTN.CallStart, locale });
    const btn = { text, callback_data: Callback.start };
    return [[btn]];
  }
  if (key === DialogKey.beginning) {
    const text = i18n.__({ phrase: BTN.Beginning, locale });
    const btn = { text, callback_data: Callback.beginning };
    return [[btn]];
  }
  if (key === DialogKey.lang) {
    return [[
      { text: i18n.__({ phrase: BTN.Lang_RU, locale }), callback_data: Callback.lang_ru },
      { text: i18n.__({ phrase: BTN.Lang_EN, locale }), callback_data: Callback.lang_en },
    ]];
  }
  if (key === DialogKey.im_smoking) {
    const text = i18n.__({ phrase: BTN.Im_Smoking, locale });
    const btn = { text, callback_data: Callback.im_smoking };
    return [[btn]];
  }
  if (key === DialogKey.start_existing) {
    return [
      [{ text: i18n.__({ phrase: BTN.Reset_Ignore, locale }), callback_data: Callback.reset_ignore }],
      [{ text: i18n.__({ phrase: BTN.Reset_Stage_2, locale }), callback_data: Callback.reset_to_stage_2 }],
      [{ text: i18n.__({ phrase: BTN.Reset_Stage_1, locale }), callback_data: Callback.reset_to_stage_1 }],
    ];
  }
  if (key === DialogKey.difficulty) {
    return [
      [{ text: i18n.__({ phrase: BTN.Level_Easy, locale }), callback_data: Callback.Level_Easy }],
      [{ text: i18n.__({ phrase: BTN.Level_Medium, locale }), callback_data: Callback.Level_Medium }],
      [{ text: i18n.__({ phrase: BTN.Level_Hard, locale }), callback_data: Callback.Level_Hard }],
    ];
  }
  if (key === DialogKey.dev) {
    return [
      [
        { text: i18n.__({ phrase: BTN.Dev_Delete_User, locale }), callback_data: Callback.Dev_Delete_User },
        { text: i18n.__({ phrase: BTN.Dev_To_Stage_1, locale }), callback_data: Callback.Dev_To_Stage_1 }
      ],
      [
        { text: i18n.__({ phrase:  BTN.Dev_Fill_Stage_1, locale }), callback_data: Callback.Dev_Fill_Stage_1 },
        { text: i18n.__({ phrase:  BTN.Dev_Stage_1_More_Max, locale }), callback_data: Callback.Dev_Stage_1_More_Max }
      ],
      [
        { text: i18n.__({ phrase: BTN.Dev_Last_Time_1_Hour, locale }), callback_data: Callback.Dev_Last_Time_1_Hour },
        { text: i18n.__({ phrase: BTN.Dev_To_Idle, locale }), callback_data: Callback.Dev_To_Idle },
      ],
      [
        { text: i18n.__({ phrase: BTN.Dev_Next, locale }), callback_data: Callback.Dev_Next },
      ]
    ];
  }
  return [];
};

export const getButtons = (lang: Lang, key: DialogKey): SendMessageOptions => {
  const inline_keyboard = selectButtonsByKey(key, lang);
  return { reply_markup: { inline_keyboard } };
};