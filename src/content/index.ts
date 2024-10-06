import { I18n, Replacements } from "i18n";
import { join as pathJoin } from "path";
import lang from "./locales";
import { Lang, Content } from "../constants";

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

export type ContentProps = Record<string, unknown>;

export const getContent = (lang: Lang, contentKey: Content, values: ContentProps = {}) => {
  const replacements: Replacements = {};
  Object.entries(values).forEach(([key, value]) => (replacements[key] = `${value}`));
  return i18n.__({ phrase: contentKey, locale: lang }, replacements);
};
