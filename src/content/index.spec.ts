import { dialogsEn  } from "./dialogs";
import { Content } from "../constants";
import { transformSingleLineContent } from "./index";
import { expect } from "chai";

describe("content", () => {
  describe("dialogs", () => {
    const testHelper = (content: string) => content.trim().split("\n").map(v => v.trim()).join("¶");

    it ("should correctly transform the content of EN > TIMEZONE_SELECTED", () => {
      const expected = testHelper(`
        🕰️ Time Zone Selected: *{{timezone}}*
        
        *This is important*❗
        Please check your current time.
        Our system detects that it’s currently *{{local_time}}* for you.
        
        Of course, a few minutes don’t matter,
        but if the time is off by half an hour or more,
        you’ll need to adjust your time zone.
        ---
        Is your current time *{{local_time}}*?
      `);
      const rawContent = dialogsEn[Content.TIMEZONE_SELECTED];
      const result = transformSingleLineContent(rawContent);
      expect(testHelper(result)).to.equal(expected);
    });
  });
});