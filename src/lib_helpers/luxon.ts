import { DateTime } from "luxon";
import { Message } from "node-telegram-bot-api";

export const tsToDateTime = (ts: unknown) => {
  const dateTime = typeof ts === "number" ? DateTime.fromMillis(ts) : DateTime.now();
  return dateTime.toFormat("dd.MM.yyyy HH:mm");
};

export const getNextSmokingTime = (msg: Message, newDelta?: number) => {
  const delta = newDelta || msg.user.deltaTime;
  const zone = msg.user.timezone;
  const mss = msg.ts + (delta * 60 * 1000);
  return DateTime.fromMillis(mss, { zone }).toFormat("HH:mm");
};

export const dateNow = () => {
  return DateTime.now().setZone("GMT").toMillis();
};

export const isValidTimeZoneCheck = (zone: string) => {
  const ms = dateNow();
  return DateTime.fromMillis(ms, { zone }).isValid;
};

export const GmtRegex = /GMT([+-])(\d+)(?::(\d+))?/;

export const gmtToUtc = (gmtOffset: string): string => {
  const match = gmtOffset.match(GmtRegex);
  if (!match) {
    throw new Error("Invalid GMT offset format");
  }
  const [, sign, hours, minutes = "00"] = match;
  const paddedHours = hours.padStart(2, "0");
  const paddedMinutes = minutes.padStart(2, "0");
  return `UTC${sign}${paddedHours}:${paddedMinutes}`;
};