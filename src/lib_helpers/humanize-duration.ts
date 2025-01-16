import humanizeDuration from "humanize-duration";
import { Lang } from "../constants";

export const minsToTimeString = (mins: number, language = Lang.EN) => {
  const ms = mins * 60 * 1000;
  const units: humanizeDuration.Unit[] = mins ? ["h", "m", "s"] : ["m"];
  return humanizeDuration (ms, { language, delimiter: " ", units, round: true });
};

export const daysToTimeString = (days: number = 0, language: string = "en") => {
  const milliseconds = days * 24 * 60* 60 * 1000;
  return humanizeDuration(milliseconds, {
    language,
    units: ["d"],
    round: true
  });
};
export const daysToString = (days: number, language = Lang.EN) => {
  const ms = days * 24 * 60 * 60 * 1000;
  return humanizeDuration (ms, { language, delimiter: " ", units: ["d"], round: true });
};
