import proxyquire from "proxyquire";
import { expect } from "chai";
import sinon from "sinon";
import { Chat, Message } from "node-telegram-bot-api";
import { IObjectID } from "monk";
import { DateTime, Settings as LuxonSettings } from "luxon";
import TgBot from "../telegram-bot";
import { Content, DialogKey, Lang } from "../constants";
import logger from "../logger";
import { PlainUser } from "../global";
import { UsersRepo } from "../db";
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
    LuxonSettings.now = () => currentDate.getTime();

    const _id = "unit-test-user-id" as unknown as IObjectID;
    user = {
      _id,
      chatId: 33333,
      lang: Lang.EN,
      timezone: "0",
      minDeltaTimesInitial: [],
      minDeltaTime: 0,
      deltaTime: 0,
      lastTime: 0, nextTime: 0,
      ignoreTime: 0,
      difficulty: 0,
      penalty: 0,
      penaltyAll: 0,
      motivizerIndex: 0,
      startDate: currentDate,
    };
    msg = {
      user,
      chat: { id: user.chatId } as Chat,
      ts: dateNow,
      message_id: 123,
      date: 123,
    };
    sinon.stub(logger, "debug");

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
    actions._res = sinon.stub().callsFake(() => {
      // actions._res = sinon.stub().callsFake((...args) => {
      // console.log(args);
      return Promise.resolve();
    });
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
      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([user, Content.FIRST_STEP, { stage_1_left: 20 }, DialogKey.im_smoking]);
      expect(updateUserStub.calledOnce).to.be.true;
      expect(updateUserStub.firstCall.args[1]).to.be.deep.equal({ lastTime: Date.now() });
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
      });
    });
  });
});
