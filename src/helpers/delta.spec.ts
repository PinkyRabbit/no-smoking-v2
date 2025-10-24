import { expect } from "chai";
import sinon from "sinon";
import { PlainUser } from "../global";
import { Settings as LuxonSettings } from "luxon";
import { IObjectID } from "monk";
import { Difficulty, HourFormat, IdempotencyKeys, Lang } from "../constants";
import { Chat, Message } from "node-telegram-bot-api";
import logger from "../logger";
import { computeNewDelta } from "./delta";

describe("helpers.delta", () => {
  let user: PlainUser;
  let msg: Message;

  beforeEach(() => {
    // lock time
    const currentDate = new Date("2023-06-15T12:00:00Z");
    const dateNow = currentDate.getTime();
    LuxonSettings.defaultZone = "Etc/GMT";

    const _id = "unit-test-user-id" as unknown as IObjectID;
    user = {
      _id,
      chatId: 33333,
      username: "unit-test-user",
      hourFormat: HourFormat.H24,
      lang: Lang.EN,
      timezone: "UTC+00:00",
      minDeltaTimesInitial: [],
      minDeltaTime: 0,
      deltaTime: 0,
      lastTime: 0,
      nextTime: 0,
      ignoreTime: 0,
      difficulty: 0,
      penalty: 0,
      penaltyAll: 7,
      penaltyDays: 1,
      winstrike: 0,
      motivizerIndex: 0,
      youCanIndex: 0,
      cigarettesInDay: 2,
      cigarettesSummary: 3,
      startDate: currentDate,
      idempotencyKey: IdempotencyKeys.One,
    };
    msg = {
      user,
      chat: { id: user.chatId } as Chat,
      ts: dateNow,
      message_id: 123,
      date: 123,
    };
    const loggerFake = ((log: string) => console.log(log)) as never;
    sinon.stub(logger, "debug").callsFake(loggerFake);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("computeNewDelta", () => {
    beforeEach(() => {
      user.deltaTime = 30.5;
      user.minDeltaTime = 25;
      user.penalty = 6;
      user.difficulty = Difficulty.MEDIUM;
    });

    describe("with 10 minute penalty", () => {
      it("should subtract 10 minutes from delta time when above minDeltaTime", () => {
        user.deltaTime = 40;
        const result = computeNewDelta(msg.user, true);
        expect(result).to.equal(user.deltaTime - 10);
      });

      it("should return minDeltaTime when result would be below minimum", () => {
        user.deltaTime = 30;
        const result = computeNewDelta(msg.user, true);
        expect(result).to.equal(user.minDeltaTime);
      });
    });

    describe("without 10 minute penalty", () => {
      it("should compute new delta correctly for MEDIUM difficulty without penalty", () => {
        user.penalty = 0;
        const result = computeNewDelta(msg.user);
        expect(result).to.equal(32.5);
      });

      it("should compute new delta correctly for HARD difficulty without penalty", () => {
        user.penalty = 0;
        user.difficulty = Difficulty.HARD;
        const result = computeNewDelta(msg.user);
        expect(result).to.equal(35.5);
      });

      it("should ignore penalty for EASY difficulty", () => {
        user.penalty = 3;
        user.difficulty = Difficulty.EASY;
        const result = computeNewDelta(msg.user);
        expect(result).to.equal(31);
      });

      it("should compute new delta correctly for MEDIUM with penalty", () => {
        user.penalty = 5;
        const result = computeNewDelta(msg.user);
        expect(result).to.equal(25); // - 2.5  (+ step 2)
      });

      it("should compute new delta correctly for HARD with penalty", () => {
        user.penalty = 4;
        const result = computeNewDelta(msg.user);
        expect(result).to.equal(25); // - 4  (+ step 5)
      });

      it("should return minDeltaTime when computed value would be below minimum", () => {
        user.penalty = 15;
        const result = computeNewDelta(msg.user);
        expect(result).to.equal(user.minDeltaTime);
      });
    });
  });
});
