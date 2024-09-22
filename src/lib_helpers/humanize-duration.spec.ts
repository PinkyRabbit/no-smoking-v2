import { expect } from "chai";
import { minsToTimeString } from "./humanize-duration";

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
      const result = minsToTimeString(75, "ru");
      expect(result).to.equal("1 час 15 минут");
    });
  });
});