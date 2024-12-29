import { expect } from "chai";
import sinon from "sinon";
import TgBot from "../telegram-bot";
import { User } from "../db";
import { Content, DialogKey, Lang } from "../constants";
import { _sendDelayedToSmokers, _sendDelayedToIgnore  } from "./smokingTimeTest";

describe("smokingTimeTest", () => {
  let clock: sinon.SinonFakeTimers;
  let user: User;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    user = {
      chatId: 33333,
      username: "unit-test-user",
      lang: Lang.EN,
      timezone: "0",
      minDeltaTimesInitial: [],
      minDeltaTime: 20,
      deltaTime: 21,
      lastTime: 0,
      nextTime: 0,
      ignoreTime: 0,
      difficulty: 0,
      penalty: 0,
      penaltyAll: 0,
      penaltyDays: 0,
      motivizerIndex: 0,
      cigarettesInDay: 0,
      cigarettesSummary: 0,
      startDate: new Date(),
    };
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  describe("sendDelayedToSmokers", () => {
    let botMock: sinon.SinonStubbedInstance<TgBot>;

    beforeEach(() => {
      botMock = sinon.createStubInstance(TgBot);
    });

    it("should not send message when users array is empty", () => {
      const users: User[] = [];
      _sendDelayedToSmokers(botMock, users);
      expect(botMock.sendToUser.called).to.be.false;
    });

    it("should send message to single user", () => {
      const users = [user];
      _sendDelayedToSmokers(botMock, users);
      expect(botMock.sendToUser.calledOnce).to.be.true;
      expect(botMock.sendToUser.calledWith(
        user,
        Content.TIME_FOR_A_SMOKE,
      )).to.be.true;
    });

    it("should send messages to multiple users with delay", () => {
      const users: User[] = [
        { ...user, chatId: 1 },
        { ...user, chatId: 2 },
        { ...user, chatId: 3 }
      ];

      _sendDelayedToSmokers(botMock, [...users]);

      // Assert first call
      expect(botMock.sendToUser.calledOnce).to.be.true;
      expect(botMock.sendToUser.calledWith(
        users[2], // Last user due to pop()
        Content.TIME_FOR_A_SMOKE,
      )).to.be.true;

      // Advance timer and check second call
      clock.tick(10);
      expect(botMock.sendToUser.calledTwice).to.be.true;
      expect(botMock.sendToUser.secondCall.calledWith(
        users[1],
        Content.TIME_FOR_A_SMOKE,
      )).to.be.true;

      // Advance timer and check third call
      clock.tick(10);
      expect(botMock.sendToUser.calledThrice).to.be.true;
      expect(botMock.sendToUser.thirdCall.calledWith(
        users[0],
        Content.TIME_FOR_A_SMOKE,
      )).to.be.true;
    });

    it("should handle users array mutation correctly", () => {
      const users: User[] = [
        { ...user, chatId: 1 },
        { ...user, chatId: 2 },
      ];
      const originalUsers = [...users];

      _sendDelayedToSmokers(botMock, users);
      clock.tick(10);

      expect(users).to.not.deep.equal(originalUsers); // Array should be modified
      expect(botMock.sendToUser.callCount).to.equal(2);
    });
  });

  describe("sendDelayedToIgnore", () => {
    let botMock: {
      sendToUser: sinon.SinonStub;
    };

    beforeEach(() => {
      botMock = {
        sendToUser: sinon.stub()
      };
    });

    it("should not send message when users array is empty", () => {
      const users: User[] = [];
      _sendDelayedToIgnore(botMock as unknown as TgBot, users);
      sinon.assert.notCalled(botMock.sendToUser);
    });

    it("should send ignore message to single user", () => {
      const users = [user];

      _sendDelayedToIgnore(botMock as unknown as TgBot, users);

      sinon.assert.calledOnce(botMock.sendToUser);
      sinon.assert.calledWith(
        botMock.sendToUser,
        user,
        Content.BOT_IGNORE,
        {},
        DialogKey.ignore
      );
    });

    it("should send ignore messages to multiple users with delay", () => {
      const users: User[] = [
        { ...user, chatId: 1 },
        { ...user, chatId: 2 },
        { ...user, chatId: 3 }
      ];

      _sendDelayedToIgnore(botMock as unknown as TgBot, [...users]);

      // Check first call
      sinon.assert.calledOnce(botMock.sendToUser);
      sinon.assert.calledWith(
        botMock.sendToUser,
        users[2], // Last user due to pop()
        Content.BOT_IGNORE,
        {},
        DialogKey.ignore
      );

      // Advance timer and check second call
      clock.tick(10);
      sinon.assert.calledTwice(botMock.sendToUser);
      sinon.assert.calledWith(
        botMock.sendToUser.secondCall,
        users[1],
        Content.BOT_IGNORE,
        {},
        DialogKey.ignore
      );

      // Advance timer and check third call
      clock.tick(10);
      sinon.assert.calledThrice(botMock.sendToUser);
      sinon.assert.calledWith(
        botMock.sendToUser.thirdCall,
        users[0],
        Content.BOT_IGNORE,
        {},
        DialogKey.ignore
      );
    });

    it("should handle array mutation correctly", () => {
      const users: User[] = [
        { ...user, chatId: 1 },
        { ...user, chatId: 2 },
      ];
      const originalUsers = [...users];

      _sendDelayedToIgnore(botMock as unknown as TgBot, users);
      clock.tick(10);

      // Check if array was modified
      expect(users).to.not.deep.equal(originalUsers);
      sinon.assert.calledTwice(botMock.sendToUser);
    });

    it("should stop sending messages when all users are processed", () => {
      const users: User[] = [user];
      _sendDelayedToIgnore(botMock as unknown as TgBot, users);
      clock.tick(20); // Advance more than one interval
      sinon.assert.calledOnce(botMock.sendToUser);
    });
  });
});
