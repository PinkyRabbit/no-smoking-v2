/**
 * This is the main constant to define all the available languages
 * @note Define language here before using it in the code
 * @enum {string} Lang
 */
export enum Lang {
  EN = "en",
  RU = "ru",
};

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
  PENALTY = "Penalty",
  TIME_FOR_A_SMOKE = "Time_For_a_Smoke",
  ON_IDLE_START = "On_Idle_Start",
  ON_IDLE_END = "On_Idle_End",
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
}
