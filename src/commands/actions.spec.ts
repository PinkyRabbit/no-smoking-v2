import proxyquire from "proxyquire";
import { expect } from "chai";
import sinon from "sinon";
import { Chat, Message } from "node-telegram-bot-api";
import { IObjectID } from "monk";
import TgBot from "../telegram-bot";
import { Actions } from "./actions";
import { Content, DialogKey, Lang } from "../constants";
import logger from "../logger";
import { PlainUser } from "../global";
import { UsersRepo } from "../db";

describe("Actions", () => {
  let botMock: sinon.SinonStubbedInstance<TgBot>;
  let actions: Actions;
  let clock: sinon.SinonFakeTimers;
  let user: PlainUser;
  let msg: Message;
  let updateUserStub: sinon.SinonStub;
  let _resSpy: sinon.SinonSpy;


  beforeEach(() => {
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
      startDate: new Date(),
    };
    msg = {
      user,
      chat: { id: user.chatId } as Chat,
      ts: Date.now(),
      message_id: 123,
      date: 123,
    };
    sinon.stub(logger, "debug");
    clock = sinon.useFakeTimers();
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

  describe("imSmokingHandler", () => {
    it ("Stage 1. Should send a welcome message on first button click.", async () => {
      await actions.imSmokingHandler(msg);
      expect(_resSpy.calledOnce).to.be.true;
      expect(_resSpy.firstCall.args).to.be.deep.equal([user, Content.FIRST_STEP, { stage_1_left: 20 }, DialogKey.im_smoking]);
    });
  });
});
