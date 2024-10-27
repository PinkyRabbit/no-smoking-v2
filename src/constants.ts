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
  EASY = 0.5,
  MEDIUM = 1,
  HARD = 2,
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
  STAGE_1_END = "Stage_1_End",
  STAGE_2_INITIAL = "Stage_2_Initial",
  STAGE_2 = "Stage_2",
  STAGE_2_IGNORE_MIN = "Stage_2_Ignore_Min",
  STAGE_2_PROPS_MISSING = "Stage_2_Props_Missing",
  PENALTY = "Penalty",
  TIME_FOR_A_SMOKE = "Time_For_a_Smoke",
  ON_IDLE_START = "On_Idle_Start",
  ON_IDLE_END = "On_Idle_End",
  DIFFICULTY = "difficulty",
  DIFFICULTY_SELECTED = "difficulty_selected",
  DIFFICULTY_EASY = "difficulty_simple",
  DIFFICULTY_MEDIUM = "difficulty_normal",
  DIFFICULTY_HARD = "difficulty_hard",
  TIMEZONE = "timezone",
  TIMEZONE_INTRO = "timezone_select",
  TIMEZONE_SELECTED = "timezone_selected",
  TIMEZONE_INVALID = "timezone_invalid",
  SETTINGS = "setting",
  SETTINGS_DONE = "setting_done",
  SETTINGS_UPDATED = "settings_updated",
  BOT_IGNORE = "bot_ignore",
  BOT_IGNORE_BUSY = "bot_ignore_busy",
  BOT_IGNORE_PENALTY_10 = "bot_ignore_penalty_10",
  BOT_IGNORE_FAILED = "bot_ignore_failed",
  BOT_IGNORE_SUCCESS = "bot_ignore_success",
  STATS = "get_stats",
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
  im_smoking = "im_smoking",
  start_existing = "start_existing",
  dev = "dev",
  difficulty = "difficulty",
  ignore = "ignore",
}
/**
 * Constant represents a motivizer keys
 * @note Define motivizer keys here before using it in the code
 * @enum {string} Motivizer
 */
export const Motivizer = "Motivizer";

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
  Dev_Delete_User = "dev_delete_user",
  Dev_To_Stage_1 = "dev_to_stage_1",
  Dev_Fill_Stage_1 = "dev_fill_stage_1",
  Dev_Last_Time_1_Hour = "dev_last_time_1_hour",
  Dev_Stage_1_More_Max = "dev_stage_1_more_than_max",
  Dev_To_Idle = "dev_to_idle",
  Dev_Next = "dev_next",
  Dev_Motivizer_25 = "dev_motivizer_25",
  Dev_Motivizer_Full = "dev_motivizer_full",
  Dev_Ignore = "dev_Ignore",
}
