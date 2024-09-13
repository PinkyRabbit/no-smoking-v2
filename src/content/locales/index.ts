import { MultilineContent } from "./types";
import { Content } from "../keys";
import { newLineRegexp } from "./constants";
import { contentRu } from "./contentRu";
import { contentEn } from "./contentEn";

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

export default {
  ru: transformMultilineContent(contentRu),
  en: transformMultilineContent(contentEn),
};