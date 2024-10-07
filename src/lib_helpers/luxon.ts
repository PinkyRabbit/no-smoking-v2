import { DateTime } from "luxon";

export const tsToDateTime = (ts: unknown) => {
  const dateTime = typeof ts === "number" ? DateTime.fromMillis(ts) : DateTime.now();
  return dateTime.toFormat("dd.MM.yyyy HH:mm");
};

export const secToTime = (seconds: number) => {
  return DateTime.fromSeconds(seconds).toFormat("HH:mm");
};
