/**
 * This is the main constant to define all the available languages
 * @note Define language here before using it in the code
 * @enum {string} Lang
 */
export enum Lang {
  EN = "en",
  RU = "ru",
}

/**
 * Constant to define all the available difficulties
 * @enum {number} Difficulty
 */
export enum Difficulty {
  DOESNT_SET = 0,
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

/**
 * Constant to define all the available hour formats
 * @enum {string} HourFormat
 */
export enum HourFormat {
  H24 = "HH:mm",
  H12 = "h:mm a",
}

/**
 * Constant to define all the available content keys
 * @note Define content keys here before using it in the code
 * @enum {string} Content
 */
export enum Content {
  MESSAGE = "MESSAGE",
  USER_UNKNOWN = "User_Unknown",
  START_NEW = "Start_New_User",
  START_EXISTING = "Start_Existing_User",
  START_EXISTING_STAGE_1 = "Start_Existing_Stage_1",
  START_RESET_IGNORE = "Start_Reset_Ignore",
  START_RESET_TO_STAGE_1 = "Start_Reset_Stage_1",
  START_RESET_TO_STAGE_2 = "Start_Reset_Stage_2",
  LANG = "Lang",
  LANG_APPLIED = "Lang_Applied",
  FIRST_STEP = "1st_Step",
  STAGE_1 = "Stage_1",
  STAGE_1_IGNORE_MIN = "Stage_1_Ignore_Min",
  STAGE_1_IGNORE_MAX = "Stage_1_Ignore_Max",
  STAGE_1_PROCESSING = "Stage_1_Processing",
  STAGE_1_YOU_CAN_RESET = "Stage_1_You_Can_Reset",
  STAGE_1_END = "Stage_1_End",
  STAGE_2_INITIAL = "Stage_2_Initial",
  STAGE_2 = "Stage_2",
  STAGE_2_SUCCESS = "Stage_2_Success",
  STAGE_2_IGNORE_MIN = "Stage_2_Ignore_Min",
  STAGE_2_PROPS_MISSING = "Stage_2_Props_Missing",
  PENALTY = "Penalty",
  PENALTY_3 = "Penalty_3",
  IDLE_NO_CIGARETTES = "Idle_No_Cigarettes",
  TIME_FOR_A_SMOKE = "Time_For_a_Smoke",
  ON_IDLE_START = "On_Idle_Start",
  ON_IDLE_END = "On_Idle_End",
  WINSTRIKE = "winstrike",
  WINSTRIKE_BASE = "winstrike_base",
  WINSTRIKE_BASE_FAILED = "winstrike_base_failed",
  WINSTRIKE_BASE_SUCCESS = "winstrike_base_success",
  DIFFICULTY = "difficulty",
  DIFFICULTY_SELECTED = "difficulty_selected",
  DIFFICULTY_EASY = "difficulty_simple",
  DIFFICULTY_MEDIUM = "difficulty_normal",
  DIFFICULTY_HARD = "difficulty_hard",
  DIFFICULTY_AUTO = "difficulty_auto",
  TIMEZONE = "timezone",
  TIMEZONE_INTRO = "timezone_select",
  TIMEZONE_SELECTED = "timezone_selected",
  TIMEZONE_INVALID = "timezone_invalid",
  SETTINGS = "setting",
  SETTINGS_DONE = "setting_done",
  SETTINGS_UPDATED = "settings_updated",
  SETTINGS_UPDATED_ON_IDLE = "settings_updated_on_idle",
  BOT_IGNORE = "bot_ignore",
  BOT_IGNORE_BUSY = "bot_ignore_busy",
  BOT_IGNORE_PENALTY_10 = "bot_ignore_penalty_10",
  BOT_IGNORE_FAILED = "bot_ignore_failed",
  BOT_IGNORE_SUCCESS = "bot_ignore_success",
  STATS = "get_stats",
  HOW = "how_to_help",
  MAXIMUM_REACHED = "maximum_reached",
  // TEST
  DEV = "Dev",
  DEV_OFF = "Dev_Off",
  DEV_USER_DELETED = "Dev_User_Deleted",
  DEV_TO_STAGE_1 = "Dev_to_Stage_1",
  DEV_FILL_STAGE_1 = "Dev_Fill_Stage_1",
  DEV_LAST_TIME_MINUS_HOUR = "Dev_Last_Time_Minus_Hour",
  DEV_STAGE_1_MORE_THAN_MAX = "Dev_Last_Time_More_Than_Max",
  DEV_TO_IDLE = "Dev_To_Idle",
  DEV_NEXT = "Dev_Next",
  DEV_MOTIVIZER = "Dev_Motivizer",
  DEV_IGNORE = "Dev_Ignore",
  DEV_LANG = "Dev_Lang",
}

/**
 * Constant to define all the available dialog keys
 * @note Define dialog keys here before using it in the code
 * @enum {string} DialogKey
 */
export enum DialogKey {
  to_start = "to_start",
  beginning = "new_user_beginning",
  lang = "lang",
  dev_lang = "dev_lang",
  im_smoking = "im_smoking",
  start_existing = "start_existing",
  dev = "dev",
  difficulty = "difficulty",
  difficulty_easy = "difficulty_easy",
  ignore = "ignore",
  max_time = "max_time",
}

/**
 * Constant represents a motivizer keys
 * @note Define motivizer keys here before using it in the code
 * @enum {string} Motivizer
 */
export const Motivizer = "Motivizer";

/**
 * Constant represents a YouCan section keys
 * @note Define youcan keys here before using it in the code
 * @enum {string} YouCan
 */
export const YouCan = "YouCan";

/**
 * Button names
 */
export enum BTN {
  CallStart = "call_start",
  Beginning = "new_user_beginning",
  Im_Smoking = "im_smoking",
  Lang_RU = "lang_ru",
  Lang_EN = "lang_en",
  Reset_Stage_1 = "reset_to_stage_1",
  Reset_Stage_2 = "reset_to_stage_2",
  Reset_Ignore = "reset_ignore",
  Level_Easy = "level_easy",
  Level_Medium = "level_medium",
  Level_Hard = "level_hard",
  Ignore_Success = "ignore_success",
  Ignore_Failed = "ignore_failed",
  Ignore_Busy = "ignore_busy",
  Ignore_Penalty_10 = "ignore_penalty_10",
  Timezone_Incorrect = "timezone_incorrect",
  Timezone_Correct_H12 = "timezone_correct_h12",
  Timezone_Correct_H24 = "timezone_correct_h24",
  Dev_Delete_User = "dev_delete_user",
  Dev_To_Stage_1 = "dev_to_stage_1",
  Dev_Fill_Stage_1 = "dev_fill_stage_1",
  Dev_Last_Time_1_Hour = "dev_last_time_1_hour",
  Dev_Stage_1_More_Max = "dev_stage_1_more_than_max",
  Dev_To_Idle = "dev_to_idle",
  Dev_To_Idle_Empty = "dev_to_idle_empty",
  Dev_To_Idle_Three_Times = "dev_to_idle_3_times",
  Dev_To_Idle_Max_Limit = "dev_to_idle_max_limit",
  Dev_Next = "dev_next",
  Dev_Motivizer_25 = "dev_motivizer_25",
  Dev_Motivizer_Full = "dev_motivizer_full",
  Dev_Ignore = "dev_Ignore",
  Dev_Content = "dev_content",
  Dev_Content_All = "dev_content_all",
  Dev_Content_RU = "dev_content_ru",
  Dev_Content_EN = "dev_content_en",
  Recommendations = "recommendations",
}
