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

export const simpleOffsetToUtc = (offset: string): string => {
  const cleanOffset = offset.replace(/^\+/, "");
  const hasAHalf = offset.includes(":30") || offset.includes(".5") ;
  const hours = parseInt(cleanOffset, 10);
  if (isNaN(hours)) {
    throw new Error("Invalid offset format");
  }
  const sign = hours >= 0 ? "+" : "-";
  const paddedHours = Math.abs(hours).toString().padStart(2, "0");
  const paddedMinutes = hasAHalf ? "30" : "00";
  return `UTC${sign}${paddedHours}:${paddedMinutes}`;
};

export const GmtRegex = /^GMT\s?[+-]((([01]?\d|2[0-3])(:[0-5]\d)?)|24:00)$/;

export const gmtToUtc = (gmtOffset: string): string => {
  const match = gmtOffset.match(GmtRegex);
  if (!match) {
    return simpleOffsetToUtc(gmtOffset);
  }
  const [gtmAndHoursPart, minutesPart] = gmtOffset.split(":");
  const minutes = minutesPart || "00";
  const hoursAndSign = gtmAndHoursPart.replace(/GMT\s?/i, "");
  const hours = hoursAndSign.match(/\d+/)![0];
  const sign = hoursAndSign.replace(hours, "") || "+";
  const paddedHours = hours.padStart(2, "0");
  const paddedMinutes = minutes.padStart(2, "0");
  return `UTC${sign}${paddedHours}:${paddedMinutes}`;
};