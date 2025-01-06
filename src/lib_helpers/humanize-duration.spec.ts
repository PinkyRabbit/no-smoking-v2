import { expect } from "chai";
import { minsToTimeString } from "./humanize-duration";
import { Lang } from "../constants";

describe("humanize-duration", () => {
  describe("-minsToTimeString", () => {
    it ("should normally convert the value", () => {
      const result = minsToTimeString(75);
      expect(result).to.equal("1 hour 15 minutes");
    });

    it ("should normally convert the value equal to hours", () => {
      const result = minsToTimeString(60);
      expect(result).to.equal("1 hour");
    });

    it ("should normally convert the value equal to multi hours", () => {
      const result = minsToTimeString(120);
      expect(result).to.equal("2 hours");
    });

    it ("should convert the value for RU locale", () => {
      const result = minsToTimeString(75, Lang.RU);
      expect(result).to.equal("1 час 15 минут");
    });

    it ("should convert the value for EN locale", () => {
      const result = minsToTimeString(75, Lang.EN);
      expect(result).to.equal("1 hour 15 minutes");
    });

    it ("should convert 2 to 2 minutes", () => {
      const result = minsToTimeString(2, Lang.EN);
      expect(result).to.equal("2 minutes");
    });

    it ("should convert 0.5 to 30 seconds", () => {
      const result = minsToTimeString(0.5, Lang.EN);
      expect(result).to.equal("30 seconds");
    });
  });
});