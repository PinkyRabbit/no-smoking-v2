import { i18n as i18n_content } from "../content";
import { i18n as i18n_buttons } from "../buttons";
import { Message } from "node-telegram-bot-api";
import { Lang } from "../constants";

export const applyLang = (lang: Lang, msg?: Message) => {
  const locales = i18n_content.getLocales();
  const toApply: Lang = locales.includes(lang) ? lang as Lang : Lang.EN;
  i18n_content.setLocale(toApply);
  i18n_buttons.setLocale(toApply);
  if (msg?.user) {
    msg.user.lang = toApply;
  }
};

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
