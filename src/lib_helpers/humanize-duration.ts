import HumanizeDuration from "humanize-duration";

export const minsToTimeString = (mins: number, language: string = "en") => {
  const ms = mins * 60 * 1000;
  return HumanizeDuration(ms, { language, delimiter: " " });
};