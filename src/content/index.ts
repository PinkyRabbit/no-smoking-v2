import { SendMessageOptions } from "node-telegram-bot-api";
import { I18n, LocaleCatalog, Replacements } from "i18n";
import { BTN, Content, DialogKey, Lang, Motivizer, YouCan } from "../constants";
import { newLineRegexp } from "./dialogs/constants";
import { ButtonOption, ContentProps, InlineKeyboard, MultilineContent, TMotivizer, TYouCan } from "./types";
import { dialogsEn, dialogsRu } from "./dialogs";
import { buttonsEn, buttonsRu } from "./buttons";
import { motivizerEn, motivizerRu } from "./motivizer";
import { youcanEn, youcanRu } from "./youcan";

const i18n = new I18n({
  locales: [Lang.RU, Lang.EN],
  defaultLocale: Lang.EN,
  updateFiles: false,
  syncFiles: false,
});

export const transformSingleLineContent = (content: string): string =>
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

export const transformMotivizerContent = (content: string[]): string[] => content
  .map((c) => c
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/-/g, "\\-")
    .replace(/\+/g, "\\+")
    .replace(/\./g, "\\.")
    .replace(/=/g, "\=")
    .replace(/!/g, "\\!")
    .trim()
    .replace(newLineRegexp, "\n")
    + "\n"
  );

const catalog = i18n.getCatalog();
catalog[Lang.RU] = {
  ...transformMultilineContent(dialogsRu),
  ...buttonsRu,
  [Motivizer]: transformMotivizerContent(motivizerRu),
  [YouCan]: youcanRu,
} as unknown as LocaleCatalog;
catalog[Lang.EN] = {
  ...transformMultilineContent(dialogsEn),
  ...buttonsEn,
  [Motivizer]: transformMotivizerContent(motivizerEn),
  [YouCan]: youcanEn,
} as unknown as LocaleCatalog;

/**
 * Content
 */
export const getContent = (lang: Lang, contentKey: Content | TMotivizer | TYouCan, values: ContentProps = {}) => {
  if (contentKey === Motivizer) {
    return i18n.__({ phrase: Motivizer, locale: lang });
  }
  if (contentKey === YouCan) {
    return i18n.__({ phrase: YouCan, locale: lang });
  }
  const replacements: Replacements = {};
  Object.entries(values).forEach(([key, value]) => (replacements[key] = `${value}`));
  return i18n.__({ phrase: contentKey, locale: lang }, replacements);
};

export { ContentProps };

/**
 * Buttons
 */

export const buttonFor = (key: BTN, locale: Lang): ButtonOption => {
  const text = i18n.__({ phrase: key, locale });
  return { text, callback_data: key };
};

const selectButtonsByKey = (key: DialogKey, locale: Lang): InlineKeyboard => {
  if (key === DialogKey.to_start) {
    return [[buttonFor(BTN.CallStart, locale)]];
  }
  if (key === DialogKey.beginning) {
    return [[buttonFor(BTN.Beginning, locale)]];
  }
  if (key === DialogKey.lang) {
    return [[
      buttonFor(BTN.Lang_RU, locale),
      buttonFor(BTN.Lang_EN, locale),
    ]];
  }
  if (key === DialogKey.dev_lang) {
    return [[
      buttonFor(BTN.Dev_Content_RU, locale),
      buttonFor(BTN.Dev_Content_EN, locale),
    ]];
  }
  if (key === DialogKey.im_smoking) {
    return [[buttonFor(BTN.Im_Smoking, locale)]];
  }
  if (key === DialogKey.start_existing) {
    return [
      [buttonFor(BTN.Reset_Ignore, locale)],
      [buttonFor(BTN.Reset_Stage_2, locale)],
      [buttonFor(BTN.Reset_Stage_1, locale)],
    ];
  }
  if (key === DialogKey.difficulty) {
    return [
      [buttonFor(BTN.Level_Easy, locale)],
      [buttonFor(BTN.Level_Hard, locale)],
      [buttonFor(BTN.Level_Medium, locale)],
    ];
  }
  if (key === DialogKey.dev) {
    return [
      [
        buttonFor(BTN.Dev_Delete_User, locale),
        buttonFor(BTN.Dev_To_Stage_1, locale),
      ],
      [
        buttonFor(BTN.Dev_Fill_Stage_1, locale),
        buttonFor(BTN.Dev_Stage_1_More_Max, locale),
      ],
      [
        buttonFor(BTN.Dev_Next_Failed, locale),
        buttonFor(BTN.Dev_Next, locale),
      ],
      [
        buttonFor(BTN.Dev_Last_Time_1_Hour, locale),
      ],
      [
        buttonFor(BTN.Dev_To_Idle, locale),
        buttonFor(BTN.Dev_To_Idle_Empty, locale),
      ],
      [
        buttonFor(BTN.Dev_To_Idle_Three_Times, locale),
        buttonFor(BTN.Dev_To_Idle_Max_Limit, locale),
      ],
      [
        buttonFor(BTN.Dev_Motivizer_25, locale),
        buttonFor(BTN.Dev_Motivizer_Full, locale),
      ],
      [
        buttonFor(BTN.Dev_Content_All, locale),
        buttonFor(BTN.Dev_Content, locale),
      ],
      [
        buttonFor(BTN.Dev_Ignore, locale),
      ]
    ];
  }
  if (key === DialogKey.ignore) {
    return [
      [buttonFor(BTN.Ignore_Success, locale)],
      [buttonFor(BTN.Ignore_Failed, locale)],
      [buttonFor(BTN.Ignore_Busy, locale)],
      [buttonFor(BTN.Ignore_Penalty_10, locale)],
    ];
  }
  if (key === DialogKey.max_time) {
    return [[buttonFor(BTN.Recommendations, locale)]];
  }
  if (key === DialogKey.difficulty_easy) {
    return [[buttonFor(BTN.Level_Easy_Ignore, locale), buttonFor(BTN.Level_Easy, locale)]];
  }
  if (key === DialogKey.local_time) {
    return [
      [buttonFor(BTN.Local_Time_Minus_1, locale), buttonFor(BTN.Local_Time_Plus_1, locale)],
      [buttonFor(BTN.Local_Time_Minus_30, locale), buttonFor(BTN.Local_Time_Plus_30, locale)],
      [buttonFor(BTN.Local_Time_AmPm, locale), buttonFor(BTN.Local_Time_24h, locale)],
      [buttonFor(BTN.Local_Time_Confirmed, locale)],
    ];
  }
  if (key === DialogKey.confirm_local_time) {
    return [
      [buttonFor(BTN.Local_Time_Wrong, locale), buttonFor(BTN.Local_Time_Correct, locale)],
    ];
  }
  if (key === DialogKey.change_level) {
    return [[buttonFor(BTN.Level_Keep_As_It_Is, locale), buttonFor(BTN.Level_Change, locale)]];
  }
  return [];
};

export const getButtons = (lang: Lang, key: DialogKey): SendMessageOptions => {
  const inline_keyboard = selectButtonsByKey(key, lang);
  return { reply_markup: { inline_keyboard } };
};

export { BTN };
