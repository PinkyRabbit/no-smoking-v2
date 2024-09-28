import { MultilineContent } from "./types";
import { Content } from "../keys";
import { B, N2, ND, NL } from "./constants";

const DEFAULT = `
The text of the message has not yet been translated.${N2}
All questions to @PinkyaRabbit
`;

export const contentEn: MultilineContent = {
  [Content.MESSAGE]: DEFAULT,
  [Content.USER_UNKNOWN]: `
    🤖 All the bot functionality is available only to authorized users.${ND}
    Please authorize first by clicking the button below.
  `,
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
  [Content.START_RESET_IGNORE]: DEFAULT,
  [Content.START_RESET_TO_STAGE_1]: DEFAULT,
  [Content.START_RESET_TO_STAGE_2]: DEFAULT,
  [Content.LANG]: "Please choose a language to use:",
  [Content.LANG_APPLIED]: "🇬🇧 You have chosen English language.",
  [Content.STAGE_1]: DEFAULT,
  [Content.FIRST_STEP]: DEFAULT,
  [Content.STAGE_1_IGNORE_MIN]: DEFAULT,
  [Content.STAGE_1_IGNORE_MAX]: DEFAULT,
  [Content.STAGE_1_PROCESSING]: DEFAULT,
  [Content.STAGE_1_END]: DEFAULT,
  [Content.STAGE_2]: DEFAULT,
  // dev
  [Content.DEV]: `
    ⚒️ ${B}Development Mode is ON${B} ⚒️${N2} 
    Select the action:
  `,
  [Content.DEV_OFF]: "Dev Mode is Off ⛔️",
};