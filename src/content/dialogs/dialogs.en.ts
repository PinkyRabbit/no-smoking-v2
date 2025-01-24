import { Content } from "../../constants";
import { MultilineContent } from "../types";
import { B, I, N2, ND, NDv2, NL } from "./constants";

const donate_link = process.env.DONATE_LINK;

export const dialogsEn: MultilineContent = {
  [Content.MESSAGE]: "Received your message",
  [Content.USER_UNKNOWN]: `
    🤖 ${B}Functionality is available only for authorized users${B}${ND}
    Please log in by clicking the button below.
  `,
  [Content.START_NEW]: `
    Hi mate! 🙂${N2}
    Are tobacco corporations profiting off your health?${NL}
    Looking for a way to quit smoking?${N2}
    Good decision!${N2}
    Together, we can do it 🤙${ND}
    Supported languages${NL}
    Click here ➤ /lang ${NL}
    🇷🇺 🇬🇧 
  `,
  [Content.START_EXISTING]: `
    Hey! ✌️${N2}
    We see that you’ve already made some progress in our app.${NL}
    Your account has been reactivated!${N2}
    You now have three options:${N2}
    1. ${B}Reset your account completely.${B}${NL}
    This will take you back to stage 1.${NL}
    Time between breaks: RESET.${N2}
    2. ${B}Clear your progress.${B}${NL}
    You will start from Stage 2, but the initial time will be reset.${NL}
    Interval between smoke breaks: ${I}{{min_delta}}${I}.${N2}
    3. ${B}Keep things as they are.${B}${NL}
    You’ll pick up right where you left off.${NL}
    ${B}Not recommended${B}.${NL}
    Time between breaks: ${I}{{real_delta}}${I}.
  `,
  [Content.START_EXISTING_STAGE_1]: `
    Hi there! ✌️${N2}
    Your account has been reactivated,${NL}
    and all data has been updated.${N2}
    You need to complete Stage 1 again ⤵️
  `,
  [Content.START_RESET_IGNORE]: `
    You have chosen to ${B}"keep things as they are"${B}${NL}
    That’s entirely up to you.${NL}
    You can reset all progress at any time by typing /start.${NL}
    ⚔️ ${B}Stage 2${B} Activated ⚔${N2}️
    The starting interval between smoke breaks${NL}
    is set to ${B}{{delta_time}}${B}.${N2}
    The time for your next smoke break will be calculated the next time you press the ${B}"I’m having a smoke"${B} button.
  `,
  [Content.START_RESET_TO_STAGE_1]: `
    Your progress ${B}has been completely reset${B}${N2}
    This is the best decision 👑${ND}
    You need to complete Stage 1 again ⤵️
  `,
  [Content.START_RESET_TO_STAGE_2]: `
    You have chosen to ${B}"Reset to Stage 2"${B}.${NL}
    The current stage progress has been reset.${ND}
    ⚔️ ${B}Stage 2${B} Activated ⚔${N2}️
    The initial interval between smoke breaks${NL}
    is set to ${B}{{delta_time}}${B}.${N2}
    The time for your next smoke break will be calculated the next time you press the ${B}"I’m having a smoke"${B} button.
  `,
  [Content.LANG]: "Please choose a language to use:",
  [Content.LANG_APPLIED]: "🇬🇧 You have chosen English language.",
  [Content.STAGE_1]: `
    ${B}Stage 1${B}${N2}
    First, we need to understand how often you smoke.${NL} 
    This time will be our starting point for our future calculations.${N2}
    To do this, let’s measure the interval between your smoke breaks 20 times. That’s just one pack.${N2}
    Intervals that are too long or too short won’t count, 
    so don’t worry if you go to sleep or simply forget to press the button.${N2}
    ${B}Alright, let’s get started!${B}${ND}
    The next time you feel like smoking, press the the ${B}"I’m having a smoke"${B} button.
  `,
  [Content.FIRST_STEP]: `
    Your time has been logged!${N2}
    Congratulations! You’ve taken the first step! 👍${N2}
    The key is to keep going and remember to press the button every time you smoke.${ND}
    ✅️ {{stage_1_left}} times left
  `,
  [Content.STAGE_1_IGNORE_MIN]: `
    You’re pressing the button too frequently.${N2}
    The minimum interval to be recorded is {{min_stage_1}}.${ND}
    💢 {{stage_1_left}} times left
  `,
  [Content.STAGE_1_IGNORE_MAX]: `
    The minimum interval to be recorded is {{max_stage_1}} minutes.${N2}
    We won’t count such long intervals to ensure accurate calculations for smoking times.${N2}
    Don’t forget to press the ${B}"I’m having a smoke"${B} button next time.${ND}
    💫 {{stage_1_left}} times left
  `,
  [Content.STAGE_1_PROCESSING]: `
    The current time has been logged!${ND}
    ✅️ {{stage_1_left}} times left
  `,
  [Content.STAGE_1_YOU_CAN_RESET]: `
    💡 For this phase, it’s very important not to miss any smoking moments,
    as your starting interval will be calculated based on them.${N2}
    If you happen to lose track, it’s better to start over by pressing /start.
  `,
  [Content.STAGE_1_END]: `
    ${B}Stage 1 Completed! 🎉${B}${N2}
    Congratulations!${N2}
    Thanks to your determination, we’ve calculated the average time to start with.${N2}
    It’s ${B}{{delta_time}}${B}.${ND}
    Let’s move on to Stage 2 ⤵️
  `,
  [Content.STAGE_2_INITIAL]: `
    ${B}All set!${B}${N2}
    Now we’ll try to stick to a smoking schedule.${NL}
    Each day, we’ll shift it by a few minutes depending on the chosen difficulty level.${N2}
    If you miss the scheduled time, no worries.${NL} 
    Just don’t forget to press the ${B}"I’m having a smoke"${B} button.${NL}
    We’ll take it into account, but it won’t stop your progress.${N2}
    Let’s get started!${ND}
    The next recommended time for you to smoke is after {{time_to_get_smoke}} ⏰️
  `,
  [Content.STAGE_2]: `
    Time logged ✅️${ND}
    The next recommended time to smoke is after {{time_to_get_smoke}} ⏰️
  `,
  [Content.STAGE_2_SUCCESS]: `
    Time logged. Well done 👍${ND}
    The next recommended time to smoke is after {{time_to_get_smoke}} ⏰️
  `,
  [Content.STAGE_2_IGNORE_MIN]: `
    You’re pressing the button too frequently.${NL}
    The minimum interval we will count is {{min_interval}}.
  `,
  [Content.STAGE_2_PROPS_MISSING]: `
    💢 Error: Settings not found.${N2}
    To access this command, your user profile must be fully configured.${ND}
    If you believe this is a mistake, please contact the developer at usesa@yandex.com{{admin_email}}
  `,
  [Content.PENALTY]: `
    The app includes a Motivational Penalty System.${N2}
    If you don’t stick to the schedule, we will slightly decrease the difficulty.${N2}
    The penalty will be applied after the next long break.${ND}
    🚭 Current penalty points: ${B}{{penalty}}${B}
  `,
  [Content.PENALTY_3]: `
    📚 Most people easily stick to the smoking schedule.${NL}
    However, we’ve noticed that your penalty points are adding up.${NL}
    You need to stabilise.${NL}
    That’s exactly why ${B}the training mode${B} was created!${N2}
    We strongly recommend ${I}switching to it and regaining your stability.${I}
  `,
  [Content.TIME_FOR_A_SMOKE]: "🔥 It's time for a smoke break! 🔥",
  [Content.IDLE_NO_CIGARETTES]: `
    🌀 ${B}Starting Fresh Today${B}${N2}
    For some reason, you didn’t log your smoke breaks last time.${NL}
    However, the fact that you haven’t given up on your goal to quit smoking speaks to your determination.${N2}
    Please, keep going!${ND}
    Your next recommended smoke break will be after {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.ON_IDLE_START]: `
    💤💤💤 ${B}Long Break${B}${N2}
    Yesterday, you smoked ${B}{{cigarettes}}${B} times${NL}
  `,
  [Content.ON_IDLE_END]: `
    The interval between your smoke smoke breaks has been recalculated:${NL}
    Previous interval: {{prev_delta}}${NL}
    \\- Penalty points: {{penalty}} \\[{{penalty_mins}}\\]${NL} 
    \\+ Step {{step}}${NL}
    \\= Adjusted interval ${I}{{new_delta}}${I}${NDv2}
    The next recommended smoke break will be after {{time_to_get_smoke}} ⏰️
  `,
  [Content.WINSTRIKE]: `
    ⚡️ You've been going strong for {{winstrike}}! Well done!
  `,
  [Content.WINSTRIKE_BASE]: `
    📚 To exit training mode, complete several consecutive days without a penalty. {{day}} / {{of_days}}
  `,
  [Content.WINSTRIKE_BASE_FAILED]: `
    📌 You are on the ${B}training${B} difficulty level. 
    It’s designed to help you understand how the bot works.${NL} 
    ${I}Penalty points are not applied.${I}
  `,
  [Content.WINSTRIKE_BASE_SUCCESS]: `
    🥁 We can see that you’ve gotten the hang of it and are ready to change the difficulty.
    To do so, press /level.
  `,
  [Content.DIFFICULTY]: `
    📈 ${B}Choose Your Difficulty Level${B}${N2}
    The app offers three difficulty levels:${N2}
    - ${B}Training Mode${B}: +0.5 minute per day${NL}
    - ${B}Normal${B}: +1 minute per day${NL}
    - ${B}Advanced${B}: +2 minutes per day${NL}
    The ${B}Training Mode${B} is ideal for beginners, helping you get used to following intervals
    even if you occasionally miss the schedule. It’s a training mode designed to help you ease into the process.${N2}
    If you’re ready to make serious progress with your habit, choose ${B}Normal${B} or ${B}Advanced${B}. 
    Normal provides a moderate pace, while Advanced is more intense, with the interval step increasing by 2 minutes.${N2}
    You can change the difficulty level anytime in the settings.
  `,
  [Content.DIFFICULTY_EASY]: "Training",
  [Content.DIFFICULTY_MEDIUM]: "Normal",
  [Content.DIFFICULTY_HARD]: "Advanced",
  [Content.DIFFICULTY_SELECTED]: `
    You can always change the difficulty level by typing /level.{ND}
    You have selected the ${B}"{{difficulty}}"${B} difficulty level.
  `,
  [Content.DIFFICULTY_AUTO]: `
    📌 Please Read This Message${N2}
    You have been assigned the Training difficulty level.${ND}
    ${B}Why is it important to start with the "Training" level?${B}${N2}
    At this stage, ${B}the main goal is to break habitual smoking patterns${B}. 
    For example, when you smoke with coffee, while waiting for a bus at the stop,
    during a break with coworkers, and so on.${N2}
    This is the hardest part. Our statistics show:${NL}
    In ${B}the first 3 days${B} , 95% of users break the schedule.${NL}
    Within ${B}the first 5 days${B}, 100% of users do.${N2}
    ${I}The Training level was designed specifically to address this challenge.${I}${ND}
    📃 ${B}How does it work?${B}${N2}
    ${B}1. Press the "I SMOKE" button, even if you break the schedule.${B}${NL}
    This helps you become aware of your habits and analyze when and where you’re most likely to slip.${N2}
    ${B}2. No penalties are applied at this stage.${B}${NL}
    Instead, you’ll focus on learning to control your habits and understand your behavior.${N2}
    ${B}3. Get used to the system.${B}${NL}
    Each day, you’ll notice yourself becoming more disciplined and sticking to the schedule better.${ND}
    ${B}What’s next?${B}${N2}
    When you feel like you’ve reduced or eliminated violations, ${B}you can switch to a more advanced difficulty level${B}.
    Penalties will then be applied, but they won’t bother you because you’ll already be prepared.${ND}
    ⬆️ ⬆️ ⬆️ ⬆️ ⬆️${NL}
    Your account setup will be completed automatically in 1 minute.
    This pause is to ensure you’ve had time to read the message above.
  `,
  [Content.TIMEZONE]: `
    🌐 ${B}Setting Your Time Zone${B}${N2}
    To set your time zone, please follow these steps:${N2}
    1. Go to ${B}Google${B} and type "timezone."${NL}
    2. Right below the search bar, you’ll see your time zone displayed in parentheses.${NL}
    3. Copy it without the parentheses and ${B}send it to us${B}.${ND}
    [Click here to go to Google](https://www.google.com/search?q=my+timezone)
  `,
  [Content.TIMEZONE_INTRO]: `
    To display the time correctly, we need to determine your time zone.
  `,
  [Content.TIMEZONE_SELECTED]: `
    🕰️ Time Zone Selected: ${B}{{timezone}}${B}${N2}
    ${B}This is important${B}❗${NL}
    Please check your current time.${NL}
    Our system detects that it’s currently ${B}{{local_time}}${B} for you.${N2}
    Of course, a few minutes don’t matter,${NL}
    but if the time is off by half an hour or more,${NL}
    you’ll need to adjust your time zone.${ND}
    Is your current time ${B}{{local_time}}${B}?
  `,
  [Content.TIMEZONE_INVALID]: `
    💢 ${B}Error: Invalid Time Zone${B}${N2}
    A correct example of a time zone is: GMT+2${NL}
    Please try again.
  `,
  [Content.SETTINGS]: `
    ${B}Stage 2. Configuration.${B}${NL}
    It’s time to adjust your settings, such as time zone, language, and difficulty level.
  `,
  [Content.SETTINGS_DONE]: `
    ${B}Account setup is complete!${B} 🎉${NL}
    Start using the bot ⤵️ 
  `,
  [Content.SETTINGS_UPDATED]: `
    ${B}Your settings have been updated${B} ✔${ND}️
    Your next recommended smoke break will be after {{time_to_get_smoke}} ⏰️ 
  `,
  [Content.SETTINGS_UPDATED_ON_IDLE]: `
    ${B}Your settings have been updated${B} ✔${ND}️
    Activate the bot by pressing the button
  `,
  [Content.BOT_IGNORE]: `
    🕵️ ${B}We lost you!${B}${N2}
    It’s been ${I}2 days${I} since your last interaction with the bot.${N2}
    We understand there could be many reasons for this, but we’d like to check in:${NL}
    ${B}Are you planning to continue or not?${B}${ND}
    Here are your options:${N2}
    1. ${I}Did you quit smoking?${I}  – If so, congratulations! 🎊${NL}
    Click the button, and we’ll share some final recommendations with you.${N2}
    2. ${I}Changed your mind about quitting?${I} – That’s unfortunate, but it’s your choice. Click "I’ll keep smoking"${N2}
    3. ${I}You were busy and didn’t have time to continue?${I} – That’s fine, it happens! Just click ${B}"Let’s continue"${B}${N2}
    4. ${I}Were you on a break and maybe got off schedule?${I} – If you slipped, click ${B}"Penalty: 10 minutes"${B}${NL}
    If your schedule is fine, just click ${B}"Let’s continue"${B} 😊 
  `,
  [Content.BOT_IGNORE_BUSY]: `
    ${B}Let’s just continue!${B} Great! 👍${ND}
    We understand that life is truly fast-paced and busy these days.${N2}
    That’s exactly why you shouldn’t give up on quitting smoking.${NL}
    You just need to finish what you started.${NL}
    Right now, your interval is ${B}{{delta_time}}${B}.${N2}
    The next time please press the the ${B}"I’m having a smoke"${B} button.
  `,
  [Content.BOT_IGNORE_PENALTY_10]: `
    You chose the "${B}10-minute penalty${B}". 
    If you believe you broke your routine, this is the best option.${N2}
    We truly appreciate your decision to continue 👍${ND}
    Your interval has been recalculated ♨${N2}️
    A ${I}10-minute penalty${I} has been applied.${NL}
    Your starting value was ${I}{{delta_min}}${I}${NL}
    The new interval between smoke breaks is now ${B}{{delta_time}}${B}.${N2}
    Next time you smoke, please press the the ${B}"I’m having a smoke"${B} button.
  `,
  [Content.BOT_IGNORE_FAILED]: `
    You decided ${B}not to quit smoking${B} 🤯${ND}
    We sincerely hope you’ll change your mind later.${N2}
    The bot will no longer send you messages.${N2}
    To activate the bot again, press /start.
  `,
  [Content.BOT_IGNORE_SUCCESS]: `
    🎈 You ${B}Quit Smoking${B}! 🎉${ND}
    That means it was all worth it 👍${N2}
    We’d like to share a few recommendations with you:${N2}
    - Remember, the first week is the hardest${NL}
    - Drink water—it makes things easier${NL}
    - Learn a new technique: when something stresses you out, take a deep breath.
    It’s a great alternative to the urge to smoke.${N2}
    Smoking is a trap.${NL} It’s just a way to take your money.${N2}
    ${B}We’re incredibly proud of your achievement!${B}${ND}
    This bot is completely non-commercial. I don’t plan to make any profit from it.
    However, if you’d like to buy me a coffee as a thank-you, I’d be very flattered.
    To do so, visit the link below and click the "Donate €3" button.${NL}
    Link: [${donate_link}](${donate_link})${NL}
    Thank you! 👍${ND}
    I hope you won’t need this,${NL}
    but if you ever start smoking again, press /start. 
  `,
  [Content.STATS]: `
    📋 ${B}Your Statistics${B}:${NL}
    - You started using the bot on {{start_date}}${NL}
    - Days since then: {{days_from_start}}${NL}
    - Total cigarettes smoked: {{cigarettes}}${NL}
    - Total penalty points applied: {{penalty_all}}${NL}
    - Starting interval{{delta_min}}${NL}
    - Current interval{{delta_time}}${NL}
  `,
  [Content.HOW]: `
    ${B}How You Can Support the Bot's Creator:${B}${N2}
    ${B}You can provide financial support${B} through a voluntary donation.${NL}
    It’s important to understand that the bot is entirely non-commercial.${NL}
    This means no matter how much you donate, I won’t alter bot functionality or include ads.${NL}
    The default donation amount is €3, but feel free to give more if you’d like.${NL}
    Link: [${donate_link}](${donate_link})${N2}
    ${B}You can help with translations into other languages.${B}${NL}
    If you’re interested, send an email to {{admin_email}}, and I’ll do my best to reply within a week.${N2}
    ${B}You can help the bot by spreading the word to your friends.${B}${NL}
    Of course, popularity isn’t the goal of this project.${NL}
    But, let’s face it, if no one knows about it, it’s all for nothing.${N2}
    ${I}No matter how you choose to help, thank you!${I}${NL}
    ${I}It means so much to me that you care about the future of this project${I} 💓
  `,
  [Content.MAXIMUM_REACHED]: `
    ${B}⚜️ You’ve Reached the Limit! ⚜️${B}${N2}
    Incredible but true—you’ve surpassed all possible boundaries!${N2}
    ${I}Unfortunately, our app doesn’t support intervals this large, so no further adjustments will be made.${I}${ND}
    ${B}If you haven’t quit smoking yet:${B}${N2}
    It’s time to leave smoking behind. Your interval is already huge, and there’s no point in continuing further.${N2}
    Check out our recommendations to help you quit for good. Simply click the button below 💙${ND}
    We wish you success no matter what! 💪
  `,
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
  [Content.DEV_MOTIVIZER]: "🔮 Motivizer Updated",
  [Content.DEV_IGNORE]: "🔮 User switched to Ignore Mode",
  [Content.DEV_LANG]: "🕉️ Select language:",
};