import { SendMessageOptions } from "node-telegram-bot-api";
import { I18n, LocaleCatalog, Replacements } from "i18n";
import { Lang, Content, Motivizer, DialogKey, BTN } from "../constants";
import { newLineRegexp } from "./dialogs/constants";
import { TMotivizer, MultilineContent, ContentProps, InlineKeyboard } from "./types";
import { dialogsRu, dialogsEn  } from "./dialogs";
import { buttonsRu, buttonsEn } from "./buttons";
import { motivizerRu, motivizerEn  } from "./motivizer";

const i18n = new I18n({
  locales: [Lang.RU, Lang.EN],
  defaultLocale: Lang.EN,
  updateFiles: false,
  syncFiles: false,
});

const transformSingleLineContent = (content: string): string =>
  content
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(newLineRegexp, "\n");

const transformMultilineContent = (content: MultilineContent): MultilineContent => {
  const result = {} as  MultilineContent;
  Object.entries(content).map((contentLine) => {
    const [key, value] = contentLine as [Content, string];
    result[key] = transformSingleLineContent(value);
  });
  return result;
};

const transformMotivizerContent = (content: string[]): string[] => content.map(transformSingleLineContent);

const catalog = i18n.getCatalog();
catalog[Lang.RU] = {
  ...transformMultilineContent(dialogsRu),
  ...buttonsRu,
  [Motivizer]: transformMotivizerContent(motivizerRu),
} as unknown as LocaleCatalog;
catalog[Lang.EN] = {
  ...transformMultilineContent(dialogsEn),
  ...buttonsEn,
  [Motivizer]: transformMotivizerContent(motivizerEn),
} as unknown as LocaleCatalog;

/**
 * Content
 */
export const getContent = (lang: Lang, contentKey: Content | TMotivizer, values: ContentProps = {}) => {
  if (contentKey === Motivizer) {
    return i18n.__({ phrase: Motivizer, locale: lang });
  }
  const replacements: Replacements = {};
  Object.entries(values).forEach(([key, value]) => (replacements[key] = `${value}`));
  return i18n.__({ phrase: contentKey, locale: lang }, replacements);
};

export { ContentProps };

/**
 * Buttons
 */
const selectButtonsByKey = (key: DialogKey, locale: Lang): InlineKeyboard => {
  if (key === DialogKey.to_start) {
    const text = i18n.__({ phrase: BTN.CallStart, locale });
    const btn = { text, callback_data: BTN.CallStart };
    return [[btn]];
  }
  if (key === DialogKey.beginning) {
    const text = i18n.__({ phrase: BTN.Beginning, locale });
    const btn = { text, callback_data: BTN.Beginning };
    return [[btn]];
  }
  if (key === DialogKey.lang) {
    return [[
      { text: i18n.__({ phrase: BTN.Lang_RU, locale }), callback_data: BTN.Lang_RU },
      { text: i18n.__({ phrase: BTN.Lang_EN, locale }), callback_data: BTN.Lang_EN },
    ]];
  }
  if (key === DialogKey.im_smoking) {
    const text = i18n.__({ phrase: BTN.Im_Smoking, locale });
    const btn = { text, callback_data: BTN.Im_Smoking };
    return [[btn]];
  }
  if (key === DialogKey.start_existing) {
    return [
      [{ text: i18n.__({ phrase: BTN.Reset_Ignore, locale }), callback_data: BTN.Reset_Ignore }],
      [{ text: i18n.__({ phrase: BTN.Reset_Stage_2, locale }), callback_data: BTN.Reset_Stage_2 }],
      [{ text: i18n.__({ phrase: BTN.Reset_Stage_1, locale }), callback_data: BTN.Reset_Stage_1 }],
    ];
  }
  if (key === DialogKey.difficulty) {
    return [
      [{ text: i18n.__({ phrase: BTN.Level_Easy, locale }), callback_data: BTN.Level_Easy }],
      [{ text: i18n.__({ phrase: BTN.Level_Medium, locale }), callback_data: BTN.Level_Medium }],
      [{ text: i18n.__({ phrase: BTN.Level_Hard, locale }), callback_data: BTN.Level_Hard }],
    ];
  }
  if (key === DialogKey.dev) {
    return [
      [
        { text: i18n.__({ phrase: BTN.Dev_Delete_User, locale }), callback_data: BTN.Dev_Delete_User },
        { text: i18n.__({ phrase: BTN.Dev_To_Stage_1, locale }), callback_data: BTN.Dev_To_Stage_1 }
      ],
      [
        { text: i18n.__({ phrase:  BTN.Dev_Fill_Stage_1, locale }), callback_data: BTN.Dev_Fill_Stage_1 },
        { text: i18n.__({ phrase:  BTN.Dev_Stage_1_More_Max, locale }), callback_data: BTN.Dev_Stage_1_More_Max }
      ],
      [
        { text: i18n.__({ phrase: BTN.Dev_Last_Time_1_Hour, locale }), callback_data: BTN.Dev_Last_Time_1_Hour },
        { text: i18n.__({ phrase: BTN.Dev_To_Idle, locale }), callback_data: BTN.Dev_To_Idle },
      ],
      [
        { text: i18n.__({ phrase: BTN.Dev_Next, locale }), callback_data: BTN.Dev_Next },
      ]
    ];
  }
  return [];
};

export const getButtons = (lang: Lang, key: DialogKey): SendMessageOptions => {
  const inline_keyboard = selectButtonsByKey(key, lang);
  return { reply_markup: { inline_keyboard } };
};

export { BTN };
