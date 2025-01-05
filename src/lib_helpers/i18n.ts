import { HourFormat, Lang } from "../constants";

/**
 * Helper to convert tg language_code to languages defined in Lang enum
 * @param lang
 */
export const tgLangCodeToLang = (lang?: string): {
  lang: Lang;
  hourFormat: HourFormat;
} =>  {
  switch (lang) {
    case "ru":
      return {
        lang: Lang.RU,
        hourFormat: HourFormat.H24,
      };
    default:
      return {
        lang: Lang.EN,
        hourFormat: HourFormat.H12,
      };
  }
};
