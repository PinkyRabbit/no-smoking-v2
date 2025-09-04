import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const level = process.env.LOG_LEVEL || "debug";

const transports: winston.transport[] = [];
const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
  const consoleLogTransport = new winston.transports.Console();
  transports.push(consoleLogTransport);
}
const logitailToken = process.env.LOGTAIL_TOKEN;
if (logitailToken) {
  const logtail = new Logtail(logitailToken);
  const logitailTransport = new LogtailTransport(logtail);
  transports.push(logitailTransport);
}

const logger = winston.createLogger({
  level,
  transports,
  format: winston.format.combine(
    winston.format.timestamp(),
    isDevelopment
      ? winston.format.colorize({ level: true })
      : winston.format.uncolorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
});

export default logger;
