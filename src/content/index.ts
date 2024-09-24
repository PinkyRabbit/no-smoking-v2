import { I18n, Replacements } from "i18n";
import { join as pathJoin } from "path";
import lang from "./locales";
import { Content } from "./keys";

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

export const contentFor = (contentKey: Content, values: Replacements = {}) => {
  return i18n.__(contentKey, { ...values, locale: "en" });
};

export { Content };