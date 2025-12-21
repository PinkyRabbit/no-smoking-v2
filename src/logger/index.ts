import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import safeStringify from "fast-safe-stringify";

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
    isDevelopment
      ? winston.format.colorize({ level: true })
      : winston.format.uncolorize(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const msg =
        typeof message === "string" ? message : safeStringify(message);
      const rest =
        meta && Object.keys(meta).length ? " " + safeStringify(meta) : "";
      return `${timestamp} ${level}: ${msg}${rest}`;
    })
  ),
});

export default logger;
