import { I18n, LocaleCatalog, Replacements } from "i18n";
import { Lang, Content, Motivizer } from "../constants";
import { newLineRegexp } from "./dialogs/constants";
import { TMotivizer, MultilineContent, ContentProps  } from "./types";
import { dialogsRu, dialogsEn  } from "./dialogs";
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
  [Motivizer]: transformMotivizerContent(motivizerRu),
} as unknown as LocaleCatalog;
catalog[Lang.EN] = {
  ...transformMultilineContent(dialogsEn),
  [Motivizer]: transformMotivizerContent(motivizerEn),
} as unknown as LocaleCatalog;

export const getContent = (lang: Lang, contentKey: Content | TMotivizer, values: ContentProps = {}) => {
  if (contentKey === Motivizer) {
    return i18n.__({ phrase: Motivizer, locale: lang });
  }
  const replacements: Replacements = {};
  Object.entries(values).forEach(([key, value]) => (replacements[key] = `${value}`));
  return i18n.__({ phrase: contentKey, locale: lang }, replacements);
};

export { ContentProps };