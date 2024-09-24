import { MultilineContent } from "./types";
import { Content } from "../keys";
import { ND, NL } from "./constants";

export const contentEn: MultilineContent = {
  [Content.MESSAGE]: "Received your message",
  [Content.START_NEW]: `
    Received your message,
    Supported languages${NL}
    Click here ➤ /lang ${NL}
    🇷🇺 🇬🇧 
  `,
  [Content.LANG]: "Please choose a language to use:",
  [Content.LANG_APPLIED]: `
    You have chosen English language.${ND}
    You can change the language any time by clicking /lang
  `,
  [Content.STAGE_1]: "Received your message",
  [Content.FIRST_STEP]: "Received your message",
  [Content.STAGE_1_IGNORE_MIN]: "Received your message",
  [Content.STAGE_1_IGNORE_MAX]: "Received your message",
  [Content.STAGE_1_PROCESSING]: "Received your message",
  [Content.STAGE_1_END]: "Received your message",
  [Content.STAGE_2]: "Received your message",
};