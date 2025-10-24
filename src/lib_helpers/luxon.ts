import { DateTime } from "luxon";
import { Lang } from "../constants";
import { daysToTimeString } from "./humanize-duration";
import { User } from "../db";
import TelegramBot from "node-telegram-bot-api";

export const dateNow = () => {
  return DateTime.utc().toMillis();
};

export const isDayToSendChatLinkCheck = () => {
  const numberOfDayToSendTheChatLink = 10;
  return DateTime.utc().day % numberOfDayToSendTheChatLink === 0;
};

export const tsToDateTime = (ts: unknown) => {
  const dateTime = typeof ts === "number" ? DateTime.fromMillis(ts) : DateTime.utc();
  return dateTime.toFormat("dd.MM.yyyy HH:mm");
};

export const mssToTime = (mss: number, { timezone: zone, hourFormat }: User) => {
  return DateTime.fromMillis(mss, { zone }).toFormat(hourFormat);
};

export const getFormattedStartDate = (jsDate: Date, locale: Lang) => {
  const luxonDate = DateTime.fromJSDate(jsDate);
  const start_date = luxonDate.setLocale(locale).toFormat("d MMMM yyyy");
  const today = DateTime.utc();
  const diff = luxonDate.diff(today, "days");
  const days = Math.floor(diff.days);
  const days_from_start = daysToTimeString(days, locale);
  return { start_date, days_from_start };
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

export const computeTimezoneShift = (msg: TelegramBot.Message, shift: 5 | 10 | -5 | -10)  => {
  if (!msg.user.timezone) {
    return "UTC+00:00";
  }
  const offset = msg.user.timezone.replace("UTC", "");
  const isNegative = offset.trim().startsWith("-");
  const [baseHoursStr, baseMinutesStr = "00"] = offset.replace("+", "").replace("-", "").split(":");
  const baseHours = parseInt(baseHoursStr, 10) || 0;
  const half = baseMinutesStr === "30" ? 5 : 0;
  const hoursValue = (isNegative ? -baseHours : baseHours) * 10;
  const minutesValue = isNegative ? -half : half;
  let summary = hoursValue + minutesValue + shift;
  if (summary > 140) summary -= 240;
  if (summary < -120) summary += 240;
  const sign = summary < 0 ? "-" : "+";
  const absTenths = Math.abs(summary);
  const hours = Math.trunc(absTenths / 10).toString().padStart(2, "0");
  const minutes = absTenths % 10 === 0 ? "00" : "30";
  return `UTC${sign}${hours}:${minutes}`;
};