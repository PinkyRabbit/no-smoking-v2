import { expect } from "chai";
import sinon from "sinon";
import TelegramBot from "node-telegram-bot-api";
import {
  computeTimeOffsetBasedOnInput,
  computeTimezoneShift,
  getFormattedStartDate,
  mssToTime,
  simpleOffsetToUtc,
  isDayToSendChatLinkCheck,
} from "./luxon";
import { HourFormat, Lang } from "../constants";
import { User } from "../db";
import { DateTime } from "luxon";

describe("lib_helpers.luxon", () => {
  describe("simpleOffsetToUtc", () => {
    it("should convert positive offset correctly", () => {
      expect(simpleOffsetToUtc("+2")).to.equal("UTC+02:00");
      expect(simpleOffsetToUtc("4")).to.equal("UTC+04:00");
    });

    it("should convert negative offset correctly", () => {
      expect(simpleOffsetToUtc("-5")).to.equal("UTC-05:00");
    });

    it("should handle single digit offsets", () => {
      expect(simpleOffsetToUtc("9")).to.equal("UTC+09:00");
      expect(simpleOffsetToUtc("-3")).to.equal("UTC-03:00");
    });

    it("should handle zero offset", () => {
      expect(simpleOffsetToUtc("0")).to.equal("UTC+00:00");
    });

    it("should throw an error for invalid input", () => {
      expect(() => simpleOffsetToUtc("abc")).to.throw("Invalid offset format");
    });

    it("should work with minutes part", () => {
      expect(simpleOffsetToUtc("-3.5")).to.equal("UTC-03:30");
      expect(simpleOffsetToUtc("02:30")).to.equal("UTC+02:30");
    });

    it("should handle string numbers", () => {
      expect(simpleOffsetToUtc("02")).to.equal("UTC+02:00");
      expect(simpleOffsetToUtc("-07")).to.equal("UTC-07:00");
    });

    it("should handle offsets greater than 12", () => {
      expect(simpleOffsetToUtc("14")).to.equal("UTC+14:00");
      expect(simpleOffsetToUtc("-13")).to.equal("UTC-13:00");
    });
  });

  describe("getFormattedStartDate", () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date("2024-02-15T00:00:00.000Z").getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("should format the date correctly for English locale", () => {
      const jsDate = new Date("2024-04-01");
      const result = getFormattedStartDate(jsDate, Lang.EN);

      expect(result.start_date).to.equal("1 April 2024");
      expect(result.days_from_start).to.equal("46 days");
    });

    it("should format the date correctly for French locale", () => {
      const jsDate = new Date("2024-03-15");
      const result = getFormattedStartDate(jsDate, Lang.RU);

      expect(result.start_date).to.equal("15 марта 2024");
      expect(result.days_from_start).to.equal("29 дней");
    });

    it("should handle the current date", () => {
      const jsDate = new Date("2024-02-15");
      const result = getFormattedStartDate(jsDate, Lang.EN);

      expect(result.start_date).to.equal("15 February 2024");
      expect(result.days_from_start).to.equal("0 days");
    });
  });

  describe("mssToTime", () => {
    it ("should correctly work for 24-h", () => {
      const user = {
        timezone: "America/New_York",
        hourFormat: HourFormat.H24
      } as User;
      const milliseconds = 1704120600000;
      const result = mssToTime(milliseconds, user);
      expect(result).to.equal("09:50");
    });

    it ("should correctly work for 12-h", () => {
      const user = {
        timezone: "America/New_York",
        hourFormat: HourFormat.H12
      } as User;
      const milliseconds = 1704120600000;
      const result = mssToTime(milliseconds, user);
      expect(result).to.equal("9:50 AM");
    });
  });

  describe("computeTimeOffsetBasedOnInput", () => {
    let clock: sinon.SinonFakeTimers;

    const makeMsg = (text: string) => ({ text } as TelegramBot.Message);

    afterEach(() => {
      if (clock) clock.restore();
    });

    it("returns UTC+00:00 when times match (now=2025-01-01T12:00Z, input=12:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("12:00"));
      expect(res).to.equal("UTC+00:00");
    });

    it("calculates positive hour shift (now=12:00Z, input=15:00 -> UTC+03:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("15:00"));
      expect(res).to.equal("UTC+03:00");
    });

    it("rounds up to the nearest 30 minutes (now=12:00Z, input=12:15 -> UTC+00:30)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("12:15"));
      expect(res).to.equal("UTC+00:30");
    });

    it("handles half-hour positive shift (now=12:00Z, input=15:29 -> rounded to 03:30)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("15:29"));
      expect(res).to.equal("UTC+03:30");
    });

    it("handles half-hour negative shift (now=12:00Z, input=08:31 -> rounded to -03:30)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("08:31"));
      expect(res).to.equal("UTC-03:30");
    });

    it("handles pure negative hour shift (now=12:00Z, input=03:00 -> UTC-09:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("03:00"));
      expect(res).to.equal("UTC-09:00");
    });

    it("adjusts >12h forward to nearest backward (now=01:00Z, input=16:00 -> diff +900 -> -540 -> UTC-09:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T01:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("16:00"));
      expect(res).to.equal("UTC-09:00");
    });

    it("adjusts <-12h backward to nearest forward (now=23:00Z, input=10:00 -> -780 -> +660 -> UTC+11:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T23:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("10:00"));
      expect(res).to.equal("UTC+11:00");
    });

    it("pads hours with zero (UTC+09:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T00:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("09:00"));
      expect(res).to.equal("UTC+09:00");
    });

    it("does not wrap at exactly 12h difference (now=12:00Z, input=00:00 -> -720 => UTC-12:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("00:00"));
      expect(res).to.equal("UTC-12:00");
    });

    it("rounds 14 minutes down to 0 (now=12:00Z, input=12:14 -> UTC+00:00)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("12:14"));
      expect(res).to.equal("UTC+00:00");
    });

    it("rounds 15 minutes up to +30 (now=12:00Z, input=12:15 -> UTC+00:30)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T12:00:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("12:15"));
      expect(res).to.equal("UTC+00:30");
    });

    it("works correctly around midnight (now=23:50Z, input=00:05 -> +15 -> UTC+00:30)", () => {
      clock = sinon.useFakeTimers(new Date("2025-01-01T23:50:00Z").getTime());
      const res = computeTimeOffsetBasedOnInput(makeMsg("00:05"));
      expect(res).to.equal("UTC+00:30");
    });
  });

  describe("computeTimezoneShift", () => {
    const makeMsg = (tz: string | null) =>
      ({ user: { timezone: tz } } as TelegramBot.Message);

    it("returns UTC+00:00 when timezone is missing", () => {
      const res = computeTimezoneShift(makeMsg(null), 10);
      expect(res).to.equal("UTC+00:00");
    });

    it("shifts whole-hour positive offset backward by 1h", () => {
      const res = computeTimezoneShift(makeMsg("UTC+05:00"), -10);
      expect(res).to.equal("UTC+04:00");
    });

    it("shifts whole-hour positive offset forward by 30m", () => {
      const res = computeTimezoneShift(makeMsg("UTC+05:00"), 5);
      expect(res).to.equal("UTC+05:30");
    });

    it("shifts half-hour positive offset forward by 30m to next hour", () => {
      const res = computeTimezoneShift(makeMsg("UTC+05:30"), 5);
      expect(res).to.equal("UTC+06:00");
    });

    it("shifts half-hour positive offset backward by 30m to whole hour", () => {
      const res = computeTimezoneShift(makeMsg("UTC+05:30"), -5);
      expect(res).to.equal("UTC+05:00");
    });

    it("handles negative half-hour correctly: -04:30 + 30m => -04:00", () => {
      const res = computeTimezoneShift(makeMsg("UTC-04:30"), 5);
      expect(res).to.equal("UTC-04:00");
    });

    it("handles -00:30 forward by 30m => +00:00", () => {
      const res = computeTimezoneShift(makeMsg("UTC-00:30"), 5);
      expect(res).to.equal("UTC+00:00");
    });

    it("handles -00:30 forward by 1h => +00:30", () => {
      const res = computeTimezoneShift(makeMsg("UTC-00:30"), 10);
      expect(res).to.equal("UTC+00:30");
    });

    it("zero-pads hours: +09:00 + 30m => +09:30", () => {
      const res = computeTimezoneShift(makeMsg("UTC+09:00"), 5);
      expect(res).to.equal("UTC+09:30");
    });

    it("zero-pads hours with negative sign: -09:30 + 30m => -09:00", () => {
      const res = computeTimezoneShift(makeMsg("UTC-09:30"), 5);
      expect(res).to.equal("UTC-09:00");
    });

    // Wrapping over the upper bound (+14:00)
    it("wraps past +14:00: +14:00 + 30m => -09:30", () => {
      const res = computeTimezoneShift(makeMsg("UTC+14:00"), 5);
      expect(res).to.equal("UTC-09:30");
    });

    it("wraps past +14:00: +13:30 + 1h => -09:30", () => {
      const res = computeTimezoneShift(makeMsg("UTC+13:30"), 10);
      expect(res).to.equal("UTC-09:30");
    });

    // Wrapping below the lower bound (-12:00)
    it("wraps past -12:00: -12:00 - 30m => +11:30", () => {
      const res = computeTimezoneShift(makeMsg("UTC-12:00"), -5);
      expect(res).to.equal("UTC+11:30");
    });

    it("wraps past -12:00: -12:30 - 30m => +11:00", () => {
      const res = computeTimezoneShift(makeMsg("UTC-12:30"), -5);
      expect(res).to.equal("UTC+11:00");
    });

    // General format sanity check
    it("returns string in format UTC[+|-]HH:(00|30)", () => {
      const res = computeTimezoneShift(makeMsg("UTC+02:30"), -5);
      expect(res).to.match(/^UTC[+-]\d{2}:(00|30)$/);
    });
  });

  describe("isDayToSendChatLinkCheck", () => {
    it("returns true on day divisible by 10", () => {
      const date = DateTime.utc(2024, 1, 10);
      const result = isDayToSendChatLinkCheck(date);

      expect(result).to.equal(true);
    });

    it("returns false on day NOT divisible by 10", () => {
      const date = DateTime.utc(2024, 1, 11);
      const result = isDayToSendChatLinkCheck(date);

      expect(result).to.equal(false);
    });

    it("returns true on 20th day", () => {
      const date = DateTime.utc(2024, 5, 20);
      expect(isDayToSendChatLinkCheck(date)).to.equal(true);
    });

    it("returns false on 31st day", () => {
      const date = DateTime.utc(2024, 7, 31);
      expect(isDayToSendChatLinkCheck(date)).to.equal(false);
    });
  });
});