import { I18n, Replacements } from "i18n";
import { join as pathJoin } from "path";
import lang from "./locales";
import { Content } from "./keys";
import { Lang } from "../constants";

export const i18n = new I18n({
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

export const contentFor = (contentKey: Content, values: Replacements = {}) => {
  return i18n.__(contentKey, { ...values });
};

export { Content };