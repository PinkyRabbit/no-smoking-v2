import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { truncateFormat } from "./truncate";

const level = process.env.LOG_LEVEL || "debug";

const transports: winston.transport[] = [];
const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
  const consoleLogTransport = new winston.transports.Console();
  transports.push(consoleLogTransport);
}
const logTailToken = process.env.LOGTAIL_TOKEN;
if (logTailToken) {
  const logTailInstance = new Logtail(logTailToken);
  const logTailTransport = new LogtailTransport(logTailInstance);
  transports.push(logTailTransport);
}

const logger = winston.createLogger({
  level,
  transports,
  format: winston.format.combine(
    winston.format.timestamp(),
    truncateFormat(),
    isDevelopment
      ? winston.format.colorize({ level: true })
      : winston.format.uncolorize(),
    winston.format.printf(({ level, message, timestamp  }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
});

export default logger;
