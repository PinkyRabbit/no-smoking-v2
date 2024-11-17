import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";
const isFileLoggingEnabled = `${process.env.LOGS_FOR_PROD_DEBUG}` === "true";

const level = isProduction && !isFileLoggingEnabled ? "info" : "debug";

const transports: winston.transport[] = [new winston.transports.Console()];
if (isFileLoggingEnabled) {
  const dirname = isProduction ? "logger/logs/" : "logs/";
  const options = {
    dirname,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    tailable: true
  };
  const onlyErrors = new winston.transports.File({ ...options, filename: "error.log", level: "error" });
  const allLogs = new winston.transports.File({ ...options, filename: "combined.log" });
  transports.push(onlyErrors, allLogs);
}

const logger = winston.createLogger({
  level,
  transports,
  format: winston.format.combine(
    winston.format.timestamp(),
    isProduction
      ? winston.format.uncolorize()
      : winston.format.colorize({ level: true }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
});

export default logger;
