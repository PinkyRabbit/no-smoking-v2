import { Lang } from "../constants";

/**
 * Helper to convert tg language_code to languages defined in Lang enum
 * @param lang
 */
export const tgLangCodeToLang = (lang?: string) =>  {
  switch (lang) {
    case "ru":
      return Lang.RU;
    default:
      return Lang.EN;
  }
};
