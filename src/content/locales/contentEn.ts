import { MultilineContent } from "./types";
import { Content } from "../keys";
import { N2, ND, NL } from "./constants";

const DEFAULT = `
The text of the message has not yet been translated.${N2}
All questions to @PinkyaRabbit
`;

export const contentEn: MultilineContent = {
  [Content.MESSAGE]: DEFAULT,
  [Content.START_NEW]: `
    Hi mate!${N2}
    ${DEFAULT}${ND}
    Supported languages${NL}
    Click here ➤ /lang ${NL}
    🇷🇺 🇬🇧 
  `,
  [Content.START_EXISTING]: `
    Hi friend! ✌️${N2}
    We see that you have made some progress in our application.${N2}
    To forget everything and start from scratch${NL}
    💥 Click here ➤ /purge${N2}
    Otherwise, re-activate your account.
  `,
  [Content.START_EXISTING_STAGE_1]: DEFAULT,
  [Content.LANG]: "Please choose a language to use:",
  [Content.LANG_APPLIED]: "🇬🇧 You have chosen English language.",
  [Content.STAGE_1]: DEFAULT,
  [Content.FIRST_STEP]: DEFAULT,
  [Content.STAGE_1_IGNORE_MIN]: DEFAULT,
  [Content.STAGE_1_IGNORE_MAX]: DEFAULT,
  [Content.STAGE_1_PROCESSING]: DEFAULT,
  [Content.STAGE_1_END]: DEFAULT,
  [Content.STAGE_2]: DEFAULT,
};