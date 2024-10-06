import { DateTime } from "luxon";

export const timestampToTime = (timestamp: number) => {
  const date = DateTime.fromSeconds(timestamp);
  return date.toFormat("HH:mm");
};

export const tsToDateTime = (ts: unknown) => {
  const dateTime = typeof ts === "number" ? DateTime.fromMillis(ts) : DateTime.now();
  return dateTime.toFormat("dd.MM.yyyy HH:mm");
};

export const secToDateTime = (sec: unknown) => {
  const dateTime = typeof sec === "number" ? DateTime.fromSeconds(sec) : DateTime.now();
  return dateTime.toFormat("dd.MM.yyyy HH:mm");
};
