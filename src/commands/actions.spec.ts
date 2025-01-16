import proxyquire from "proxyquire";
import { expect } from "chai";
import sinon from "sinon";
import { Chat, Message } from "node-telegram-bot-api";
import { IObjectID } from "monk";
import { DateTime, Settings as LuxonSettings } from "luxon";
import TgBot from "../telegram-bot";
import { Content, DialogKey, Difficulty, HourFormat, Lang } from "../constants";
import logger from "../logger";
import { PlainUser } from "../global";
import { UsersRepo } from "../db";
import { IGNORE_TIME, MIN_INTERVAL, STAGE_1_MAX, STAGE_1_STEPS, USER_IDLE_TIME } from "./constants";
import { Actions } from "./actions";

describe("Actions", () => {
  let botMock: sinon.SinonStubbedInstance<TgBot>;
  let actions: Actions;
  let clock: sinon.SinonFakeTimers;
  let user: PlainUser;
  let msg: Message;
  let updateUserStub: sinon.SinonStub;
  let _resSpy: sinon.SinonSpy;

  beforeEach(() => {
    // lock time
    const currentDate = new Date("2023-06-15T12:00:00Z");
    const dateNow = currentDate.getTime();
    clock = sinon.useFakeTimers(dateNow);
    LuxonSettings.defaultZone = "Etc/GMT";

    const _id = "unit-test-user-id" as unknown as IObjectID;
    user = {
      _id,
      chatId: 33333,
      username: "unit-test-user",
      hourFormat: HourFormat.H24,
      lang: Lang.EN,
      timezone: "0",
      minDeltaTimesInitial: [],
      minDeltaTime: 0,
      deltaTime: 0,
      lastTime: 0, nextTime: 0,
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

    const decoratorStub = sinon.stub().callsFake(
      function testDecorator(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        return descriptor;
      }
    );
    const constructorStub = sinon.stub().callsFake(
      function testConstructor<T extends new (...args: unknown[]) => Actions>(constructor: T) {
        return constructor;
      }
    );
    updateUserStub = sinon.stub(UsersRepo, "updateUser").resolves();
    const actionsModule = proxyquire("./actions", {
      "./decorators": {
        transformMsg: decoratorStub,
        onlyForKnownUsers: decoratorStub,
        LogActionCalls: constructorStub,
      },
      "../db": {
        UsersRepo: {
          updateUser: updateUserStub,
        },
      }
    });
    const Actions = actionsModule.Actions;
    botMock = sinon.createStubInstance(TgBot);
    actions = new Actions(botMock);
    actions._res = sinon.stub().resolves();
    _resSpy = actions._res as sinon.SinonSpy;
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  it ("timers should be frozen", () => {
    expect(new Date().toISOString()).to.equal("2023-06-15T12:00:00.000Z");
    expect(DateTime.now().toISO()).to.equal("2023-06-15T12:00:00.000+00:00");
  });

  describe("imSmokingHandler", () => {
    it ("Stage 1. Should send a FIRST_STEP message on first button click.", async () => {
      user.cigarettesInDay = 0;
      user.cigarettesSummary = 0;
      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([user, Content.FIRST_STEP, { stage_1_left: 20 }, DialogKey.im_smoking]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({ lastTime: Date.now(), cigarettesSummary: 1 });
    });

    it("Stage 1. Should send a STAGE_1_PROCESSING message on second button click.", async () => {
      user.lastTime = Date.now();

      // shift time 20 minutes
      const timeShift = 20 * 60 * 1000;
      msg.ts += timeShift;
      clock.tick(timeShift);

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([user, Content.STAGE_1_PROCESSING, { stage_1_left: 19 }, DialogKey.im_smoking]);
    });

    it ("Stage 1. On STAGE_1_PROCESSING second click should correctly update the User", async () => {
      user.lastTime = Date.now();

      const minutes = 47;
      const timeShift = minutes * 60 * 1000;
      msg.ts += timeShift;
      clock.tick(timeShift);

      await actions.imSmokingHandler(msg);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        minDeltaTimesInitial: [minutes],
        cigarettesSummary: user.cigarettesSummary + 1,
      });
    });

    it ("Stage 1. On STAGE_1_PROCESSING should correctly shift time in middle", async () => {
      user.lastTime = Date.now();
      user.minDeltaTimesInitial = [10, 20, 30, 40];

      const minutes = 47;
      const timeShift = minutes * 60 * 1000;
      msg.ts += timeShift;
      clock.tick(timeShift);

      await actions.imSmokingHandler(msg);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        minDeltaTimesInitial: [...msg.user.minDeltaTimesInitial, minutes],
        cigarettesSummary: user.cigarettesSummary + 1,
      });
    });

    it ("Stage 1. Show notification if user clicking too quickly", async () => {
      user.lastTime = Date.now();
      user.minDeltaTimesInitial = [10, 20, 30, 40];

      const minutes = MIN_INTERVAL - 1;
      const timeShift = minutes * 60 * 1000;
      msg.ts += timeShift;
      clock.tick(timeShift);

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal(
        [
          user,
          Content.STAGE_1_IGNORE_MIN,
          {
            min_stage_1: `${MIN_INTERVAL} minutes`,
            stage_1_left: STAGE_1_STEPS - user.minDeltaTimesInitial.length,
          },
          DialogKey.im_smoking,
        ]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({ lastTime: msg.user.lastTime });
    });

    it ("Stage 1. Show notification if click delay is bigger than maximum", async () => {
      user.lastTime = Date.now();
      user.minDeltaTimesInitial = [10, 20, 30, 40];

      const minutes = STAGE_1_MAX + 1;
      const timeShift = minutes * 60 * 1000;
      msg.ts += timeShift;
      clock.tick(timeShift);

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal(
        [
          user,
          Content.STAGE_1_IGNORE_MAX ,
          {
            max_stage_1: STAGE_1_MAX,
            stage_1_left: STAGE_1_STEPS - user.minDeltaTimesInitial.length,
          },
          DialogKey.im_smoking,
        ]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        cigarettesSummary: user.cigarettesSummary + 1,
      });
    });

    it ("Stage 1. Should show additional hint if the value is twice more than middle value", async () => {
      user.lastTime = Date.now();
      user.minDeltaTimesInitial = [10, 20, 30, 40];
      const middleValue = user.minDeltaTimesInitial.reduce((a, b) => a + b, 0) / user.minDeltaTimesInitial.length;
      const minutes = middleValue * 2 + 1;
      const timeShift = minutes * 60 * 1000;
      msg.ts += timeShift;
      clock.tick(timeShift);
      const expectedStage1Left = STAGE_1_STEPS - user.minDeltaTimesInitial.length - 1;

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledTwice).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([user, Content.STAGE_1_YOU_CAN_RESET ]);
      expect(_resSpy.secondCall.args).to.be.deep.equal([user, Content.STAGE_1_PROCESSING, { stage_1_left: expectedStage1Left }, DialogKey.im_smoking]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        minDeltaTimesInitial: [...msg.user.minDeltaTimesInitial, minutes],
        cigarettesSummary: user.cigarettesSummary + 1,
      });
    });

    it("Stage 1. Should complete the Stage 1 on full minDeltaInitial", async () => {
      const minDeltaTimesInitial = [];
      let step = 30;
      for (let i = 0; i < STAGE_1_STEPS - 1; i++) {
        minDeltaTimesInitial.push(MIN_INTERVAL + step);
        step += 3;
      }
      user.minDeltaTimesInitial = minDeltaTimesInitial;
      user.lastTime = Date.now();
      const minutes = 47;
      const timeShift = minutes * 60 * 1000;
      msg.ts += timeShift;

      const EXPECTED_MINUTES = 76;
      const EXPECTED_STRING = "1 hour 16 minutes";

      const onLevelStub = sinon.stub(actions, "onTimezone").resolves();

      await actions.imSmokingHandler(msg);

      expect(_resSpy.calledTwice).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([user, Content.STAGE_1_END, { delta_time:  EXPECTED_STRING }]);
      expect(_resSpy.secondCall.args).to.be.deep.equal([user, Content.SETTINGS]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        minDeltaTimesInitial: [],
        deltaTime: EXPECTED_MINUTES,
        minDeltaTime: EXPECTED_MINUTES,
        cigarettesSummary: user.cigarettesSummary + 1,
      });
      expect(onLevelStub.calledOnce).to.be.true;
    });

    it ("Stage 2. Should not enter stage 2 without required props", async () => {
      const timeShift = 100 * 60 * 1000;
      user.lastTime = Date.now();
      user.deltaTime = 73;
      user.minDeltaTime = 73;
      msg.ts = user.lastTime  + timeShift;

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args[1]).to.be.deep.equal(Content.STAGE_2_PROPS_MISSING);
    });

    it ("Stage 2. Should correctly compute the next value for I'm smoking", async () => {
      const timeShift = 100 * 60 * 1000;
      user.lastTime = Date.now();
      user.deltaTime = 73;
      user.minDeltaTime = 52;
      user.timezone = "UTC+01:00";
      user.lang = Lang.RU;
      user.difficulty = Difficulty.EASY;
      user.cigarettesInDay += 1;
      user.cigarettesSummary += 1;
      msg.ts = user.lastTime + timeShift;

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([
        user,
        Content.STAGE_2_SUCCESS,
        { time_to_get_smoke: "15:53" },
        DialogKey.im_smoking,
      ]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        nextTime: msg.ts + (user.deltaTime * 60 * 1000),
        ignoreTime: msg.ts + IGNORE_TIME,
        cigarettesInDay: user.cigarettesInDay + 1,
        cigarettesSummary: user.cigarettesSummary + 1,
        winstrike: 0,
      });
    });

    it ("Stage 2. Should ignore too quick calls", async () => {
      const timeShift = (MIN_INTERVAL - 1) * 60 * 1000;
      user.lastTime = Date.now();
      user.deltaTime = 73;
      user.minDeltaTime = 52;
      user.timezone = "UTC+01:00";
      user.lang = Lang.RU;
      user.difficulty = Difficulty.EASY;
      msg.ts = user.lastTime + timeShift;

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args[1]).to.be.equal(Content.STAGE_2_IGNORE_MIN);
      expect(updateUserStub.called).to.be.false;
    });

    it ("Stage 2. Should use a penalty if value is lower than delta time", async () => {
      user.lastTime = Date.now();
      user.deltaTime = 73;
      user.minDeltaTime = 52;
      user.timezone = "UTC+01:00";
      user.lang = Lang.RU;
      user.difficulty = Difficulty.EASY;
      user.penalty = 2;
      user.penaltyAll = 8;
      user.nextTime = user.lastTime + (user.deltaTime * 60 * 1000);
      const timeShift = (user.deltaTime - 1) * 60 * 1000;
      msg.ts = user.lastTime + timeShift;

      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledTwice).to.be.true;
      expect(_resSpy.firstCall.args[1]).to.be.equal(Content.PENALTY);
      expect(_resSpy.firstCall.args[2]).to.be.deep.equal({ penalty: user.penalty + 1 });
      expect(_resSpy.secondCall.args).to.be.deep.equal([
        user,
        Content.STAGE_2,
        { time_to_get_smoke: "15:25" },
        DialogKey.im_smoking,
      ]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        nextTime: msg.ts + (user.deltaTime * 60 * 1000),
        ignoreTime: msg.ts + IGNORE_TIME,
        penalty: user.penalty + 1,
        penaltyAll: user.penaltyAll + 1,
        cigarettesInDay: user.cigarettesInDay + 1,
        cigarettesSummary: user.cigarettesSummary + 1,
        winstrike: 0,
      });
    });

    it ("Stage 2. Should display motivizer for too big pause", async () => {
      const timeShift = (USER_IDLE_TIME + 1)* 60 * 1000;
      user.lastTime = Date.now();
      user.deltaTime = 73;
      user.minDeltaTime = 52;
      user.timezone = "UTC+01:00";
      user.lang = Lang.RU;
      user.difficulty = Difficulty.HARD;
      msg.ts = user.lastTime + timeShift;

      await actions.imSmokingHandler(msg);
      expect(_resSpy.called).to.be.false;
      expect(botMock.sendMessage.calledOnce).to.be.true;
    });

    it ("Stage 2. Should correctly update the user for too big pause", async () => {
      const timeShift = (USER_IDLE_TIME + 1) * 60 * 1000;
      user.lastTime = Date.now();
      user.deltaTime = 73.5;
      user.penalty = 3;
      user.minDeltaTime = 52;
      user.timezone = "UTC+01:00";
      user.lang = Lang.RU;
      user.difficulty = Difficulty.HARD;
      msg.ts = user.lastTime + timeShift;

      await actions.imSmokingHandler(msg);

      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({
        lastTime: msg.ts,
        ignoreTime: msg.ts + IGNORE_TIME,
        penalty: 0,
        penaltyDays: user.penaltyDays + 1,
        motivizerIndex: 1,
        deltaTime: 72,
        nextTime: 1686852780000,
        cigarettesInDay: 0,
        cigarettesSummary: user.cigarettesSummary + 1,
        winstrike: 0,
      });
    });
  });

  describe("_computeNewDelta", () => {
    beforeEach(() => {
      user.deltaTime = 30.5;
      user.minDeltaTime = 25;
      user.penalty = 6;
      user.difficulty = Difficulty.MEDIUM;
    });

    describe("with 10 minute penalty", () => {
      it("should subtract 10 minutes from delta time when above minDeltaTime", () => {
        user.deltaTime = 40;
        const result = actions._computeNewDelta(msg.user, true);
        expect(result).to.equal(user.deltaTime - 10);
      });

      it("should return minDeltaTime when result would be below minimum", () => {
        user.deltaTime = 30;
        const result = actions._computeNewDelta(msg.user, true);
        expect(result).to.equal(user.minDeltaTime);
      });
    });

    describe("without 10 minute penalty", () => {
      it("should compute new delta correctly for MEDIUM difficulty without penalty", () => {
        user.penalty = 0;
        const result = actions._computeNewDelta(msg.user);
        expect(result).to.equal(31.5);
      });

      it("should compute new delta correctly for HARD difficulty without penalty", () => {
        user.penalty = 0;
        user.difficulty = Difficulty.HARD;
        const result = actions._computeNewDelta(msg.user);
        expect(result).to.equal(32.5);
      });

      it("should ignore penalty for EASY difficulty", () => {
        user.penalty = 3;
        user.difficulty = Difficulty.EASY;
        const result = actions._computeNewDelta(msg.user);
        expect(result).to.equal(31);
      });

      it("should compute new delta correctly for MEDIUM with penalty", () => {
        user.penalty = 5;
        const result = actions._computeNewDelta(msg.user);
        expect(result).to.equal(29); // - 2.5  (+ step 1)
      });

      it("should compute new delta correctly for HARD with penalty", () => {
        user.penalty = 4;
        const result = actions._computeNewDelta(msg.user);
        expect(result).to.equal(29.5);  // - 4  (+ step 2)
      });

      it("should return minDeltaTime when computed value would be below minimum", () => {
        user.penalty = 15;
        const result = actions._computeNewDelta(msg.user);
        expect(result).to.equal(user.minDeltaTime);
      });
    });
  });
});
