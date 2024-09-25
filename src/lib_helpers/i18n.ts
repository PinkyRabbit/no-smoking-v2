import { i18n as i18n_content } from "../content";
import { i18n as i18n_buttons } from "../buttons";
import { Message } from "node-telegram-bot-api";
import { Lang } from "../commands/constants";

export const applyLang = (lang: string, msg?: Message) => {
  const locales = i18n_content.getLocales();
  const toApply: Lang = locales.includes(lang) ? lang as Lang : Lang.RU;
  i18n_content.setLocale(toApply);
  i18n_buttons.setLocale(toApply);
  if (msg?.user) {
    msg.user.lang = toApply;
  }
};
