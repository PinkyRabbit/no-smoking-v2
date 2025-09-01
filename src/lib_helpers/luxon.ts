import { DateTime } from "luxon";
import { Lang } from "../constants";
import { daysToTimeString } from "./humanize-duration";
import { User } from "../db";
import TelegramBot from "node-telegram-bot-api";

export const tsToDateTime = (ts: unknown) => {
  const dateTime = typeof ts === "number" ? DateTime.fromMillis(ts) : DateTime.now();
  return dateTime.toFormat("dd.MM.yyyy HH:mm");
};

export const mssToTime = (mss: number, { timezone: zone, hourFormat }: User) => {
  return DateTime.fromMillis(mss, { zone }).toFormat(hourFormat);
};

export const getFormattedStartDate = (jsDate: Date, locale: Lang) => {
  const luxonDate = DateTime.fromJSDate(jsDate);
  const start_date = luxonDate.setLocale(locale).toFormat("d MMMM yyyy");
  const today = DateTime.now().setZone("GMT");
  const diff = luxonDate.diff(today, "days");
  const days = Math.floor(diff.days);
  const days_from_start = daysToTimeString(days, locale);
  return { start_date, days_from_start };
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

export const computeTimeOffsetBasedOnInput = (msg: TelegramBot.Message) => {
  const userInput = msg.text!.trim();
  const nowUtc = DateTime.utc();
  const [hh, mm] = userInput.split(":").map(Number);
  let userTime = nowUtc.set({ hour: hh, minute: mm, second: 0, millisecond: 0 });
  let diffMinutes = userTime.diff(nowUtc, "minutes").toObject().minutes ?? 0;
  if (diffMinutes > 720) diffMinutes -= 1440;
  if (diffMinutes < -720) diffMinutes += 1440;
  diffMinutes = Math.round(diffMinutes / 30) * 30;
  const isNegative = diffMinutes < 0;
  const isHalfShift = diffMinutes % 60;
  const absMinutes = Math.abs(diffMinutes);
  const hours = Math.floor(absMinutes / 60);
  return `UTC${isNegative ? "-" : "+"}${hours < 10 ? "0" + hours : hours}:${isHalfShift ? "30" : "00"}`;
};