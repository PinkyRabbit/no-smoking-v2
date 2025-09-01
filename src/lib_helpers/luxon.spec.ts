import { expect } from "chai";
import sinon from "sinon";
import TelegramBot from "node-telegram-bot-api";
import {
  computeTimeOffsetBasedOnInput,
  getFormattedStartDate,
  mssToTime,
  simpleOffsetToUtc,
} from "./luxon";
import { HourFormat, Lang } from "../constants";
import { User } from "../db";

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
});