import humanizeDuration from "humanize-duration";

export const minsToTimeString = (mins: number, language: string = "en") => {
  if (!mins) {
    return "0";
  }
  const ms = mins * 60 * 1000;
  return humanizeDuration (ms, { language, delimiter: " ", units: ["h", "m", "s"], round: true });
};

export const daysToTimeString = (days: number = 0, language: string = "en") => {
  const milliseconds = days * 24 * 60* 60 * 1000;
  return humanizeDuration(milliseconds, {
    language,
    units: ["d"],
    round: true
  });
};
