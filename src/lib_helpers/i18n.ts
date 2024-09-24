import { i18n as i18n_content } from "../content";
import { i18n as i18n_buttons } from "../buttons";

export const applyLang = (lang: string) => {
  const locales = i18n_content.getLocales();
  const toApply = locales.includes(lang) ? lang : "ru";
  i18n_content.setLocale(toApply);
  i18n_buttons.setLocale(toApply);
};
