import { expect } from "chai";
import sinon from "sinon";
import { getFormattedStartDate, GmtRegex, gmtToUtc, simpleOffsetToUtc } from "./luxon";
import { Lang } from "../constants";

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

  describe("GmtRegex", () => {
    const isValidGtmCheck = (val: string) => GmtRegex.test(val);

    it("should match valid GMT offset formats", () => {
      expect(isValidGtmCheck("GMT+2")).to.eq(true);
      expect(isValidGtmCheck("GMT+02")).to.eq(true);
      expect(isValidGtmCheck("GMT-05")).to.eq(true);
      expect(isValidGtmCheck("GMT+00:00")).to.eq(true);
      expect(isValidGtmCheck("GMT +00:00")).to.eq(true);
      expect(isValidGtmCheck("GMT+02:30")).to.eq(true);
      expect(isValidGtmCheck("GMT-10:45")).to.eq(true);
      expect(isValidGtmCheck("GMT+00:00")).to.eq(true);
      expect(isValidGtmCheck("GMT-23:59")).to.eq(true);
      expect(isValidGtmCheck("GMT+24:00")).to.eq(true);
    });

    it("should not match invalid GMT offset formats", () => {
      expect(isValidGtmCheck("+2")).to.eq(false);
      expect(isValidGtmCheck("+02")).to.eq(false);
      expect(isValidGtmCheck("UTC+02")).to.eq(false);
      expect(isValidGtmCheck("GMT2")).to.eq(false);
      expect(isValidGtmCheck("GMT+2:60")).to.eq(false);
      expect(isValidGtmCheck("GMT+25:00")).to.eq(false);
    });
  });

  describe("gmtToUtc", () => {
    it("should convert positive GMT offset correctly", () => {
      expect(gmtToUtc("GMT+2")).to.equal("UTC+02:00");
      expect(gmtToUtc("GMT+02")).to.equal("UTC+02:00");
      expect(gmtToUtc("GMT+2:30")).to.equal("UTC+02:30");
    });

    it("should convert negative GMT offset correctly", () => {
      expect(gmtToUtc("GMT-5")).to.equal("UTC-05:00");
      expect(gmtToUtc("GMT-05")).to.equal("UTC-05:00");
      expect(gmtToUtc("GMT-5:45")).to.equal("UTC-05:45");
    });

    it("should handle single digit hours", () => {
      expect(gmtToUtc("GMT+9")).to.equal("UTC+09:00");
      expect(gmtToUtc("GMT-3")).to.equal("UTC-03:00");
    });

    it("should handle zero offset", () => {
      expect(gmtToUtc("GMT+0")).to.equal("UTC+00:00");
      expect(gmtToUtc("GMT-0")).to.equal("UTC-00:00");
    });

    it("should throw an error for invalid input", () => {
      expect(() => gmtToUtc("UTC+2")).to.throw("Invalid GMT offset format");
      expect(() => gmtToUtc("GMT2")).to.throw("Invalid GMT offset format");
      expect(() => gmtToUtc("GMT+2:60")).to.throw("Invalid GMT offset format");
      // expect(() => gmtToUtc("GMT+24")).to.throw("Invalid GMT offset format");
    });

    it("should handle offsets with minutes", () => {
      expect(gmtToUtc("GMT+5:30")).to.equal("UTC+05:30");
      expect(gmtToUtc("GMT-3:15")).to.equal("UTC-03:15");
    });

    it("should handle offsets at the extremes", () => {
      expect(gmtToUtc("GMT+14")).to.equal("UTC+14:00");
      expect(gmtToUtc("GMT-12")).to.equal("UTC-12:00");
    });

    it("should handle offsets with leading zeros", () => {
      expect(gmtToUtc("GMT+02:00")).to.equal("UTC+02:00");
      expect(gmtToUtc("GMT-09:30")).to.equal("UTC-09:30");
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
});