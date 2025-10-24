import { BTN, Lang } from "../constants";
import { buttonFor } from "../content";

export const getIdleVariants = (lang: Lang): {
  from_scratch_message: string,
  no_penalty_message: string,
  penalty_10_message: string
} => (  {
  from_scratch_message: buttonFor(BTN.Ignore_Full_Reset, lang).text,
  no_penalty_message: buttonFor(BTN.Ignore_Just_Go_On, lang).text,
  penalty_10_message: buttonFor(BTN.Ignore_Penalty_10, lang).text,
});
