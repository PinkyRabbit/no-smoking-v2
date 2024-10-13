import { MultilineContent } from "./types";
import { Content } from "../../constants";
import { B, I, N2, ND, NL } from "./constants";

const DEFAULT = `
The text of the message has not yet been translated.${N2}
All questions to @PinkyaRabbit
`;

export const contentEn: MultilineContent = {
  [Content.MESSAGE]: "Received your message",
  [Content.USER_UNKNOWN]: `
    🤖 All the bot functionality is available only to authorized users.${ND}
    Please authorize first by clicking the button below.
  `,
  [Content.START_NEW]: `
    Hi mate!${N2}
    Are tobacco corporations profiting off your health?${N2}
    Looking for a way to quit smoking?${N2}
    You are Smart!${N2}
    Together we can do it 🤙${ND}
    Supported languages${NL}
    Click here ➤ /lang ${NL}
    🇷🇺 🇬🇧 
  `,
  [Content.START_EXISTING]: `
    Hey! ✌️${N2}
    We can see your previous progress in our application.${NL}
    Your account is active now!${N2}
    There are three ways to go:${N2}
    1. Full Account Reset.${NL}
    On this action you'll ${B}start from Stage 1${B}.${NL} 
    Time between smoking: ${I}RESET${I}.${N2}
    2. Clean up the progress.${NL}
    You'll start ${B}from Stage 2${B}, but Delta time will be reset.{NL} 
    Time between smoking: ${I}{{min_delta}}${I}.${N2}
    3. Keep as it is.${NL}
    You'll carry on with the place where you left the account.${NL}
    ${B}Not recommended${B}.${NL}
    Time between smoking: ${I}{{real_delta}}${I}.${N2}
  `,
  [Content.START_EXISTING_STAGE_1]: `
    Hey! ✌️${N2}
    Your account has been reactivated,${NL}
    all the data reset.${N2}
    You need to pass the Stage 1 ⤵️ 
  `,
  [Content.START_RESET_IGNORE]: DEFAULT,
  [Content.START_RESET_TO_STAGE_1]: DEFAULT,
  [Content.START_RESET_TO_STAGE_2]: DEFAULT,
  [Content.LANG]: "Please choose a language to use:",
  [Content.LANG_APPLIED]: "🇬🇧 You have chosen English language.",
  [Content.STAGE_1]: `
    ${B}Stage 1${B}${N2}
    First things first, we need to understand${NL} 
    the Delta Time of your smoking.${N2}
    To do this, we need to compare time interval between${NL} 
    20 smoke breaks.of your. It's just one pack of cigarettes.${N2}
    Too big or too small intervals will not make any difference. 
    So you don't have to worry if you go to sleep
    or just forget to press the button.${N2}
    Ok. Lets start.${ND}
    Next time you want to smoke, press the button "${B}I'm Smoking${B}".
  `,
  [Content.FIRST_STEP]: DEFAULT,
  [Content.STAGE_1_IGNORE_MIN]: DEFAULT,
  [Content.STAGE_1_IGNORE_MAX]: DEFAULT,
  [Content.STAGE_1_PROCESSING]: DEFAULT,
  [Content.STAGE_1_END]: DEFAULT,
  [Content.STAGE_2]: DEFAULT,
  [Content.STAGE_2_INITIAL]: DEFAULT,
  [Content.STAGE_2_IGNORE_MIN]: DEFAULT,
  [Content.PENALTY]: `
    The app has a ${I}Motivating Penalty System${I}.${N2}
    If you don't keep to the schedule, we slightly reduce the difficulty.${N2}
    The penalty will be applied after the next big pause.${ND}
    🚭 Current number of penalty points: ${B}{{penalty}}${B}
  `,
  [Content.TIME_FOR_A_SMOKE]: "🔥 It's time for a smoke break! 🔥",
  [Content.ON_IDLE_START]: DEFAULT,
  [Content.ON_IDLE_END]: DEFAULT,
  [Content.DIFFICULTY]: DEFAULT,
  [Content.DIFFICULTY_EASY]: DEFAULT,
  [Content.DIFFICULTY_MEDIUM]: DEFAULT,
  [Content.DIFFICULTY_HARD]: DEFAULT,
  [Content.DIFFICULTY_SELECTED]: DEFAULT,
  [Content.TIMEZONE]: DEFAULT,
  [Content.TIMEZONE_INTRO]: DEFAULT,
  [Content.TIMEZONE_SELECTED]: DEFAULT,
  // dev
  [Content.DEV]: `⚒️ ${B}Development Mode is ON${B} ⚒️`,
  [Content.DEV_OFF]: "Dev Mode is Off ⛔️",
  [Content.DEV_USER_DELETED]: "🔮 User Deleted /start",
  [Content.DEV_TO_STAGE_1]: "🔮 Your user was reset to Stage 1",
  [Content.DEV_FILL_STAGE_1]: "🔮 Stage 1 was filled, {{stepsAdded}} steps added",
  [Content.DEV_LAST_TIME_MINUS_HOUR]: "🔮 Last time set to 1 hour ago",
  [Content.DEV_STAGE_1_MORE_THAN_MAX]: "🔮 Last time set to more than max value",
  [Content.DEV_TO_IDLE]: "🔮 User switched to Idle mode",
  [Content.DEV_NEXT]: "🔮 Next smoke break will happen in 1 minute",
};