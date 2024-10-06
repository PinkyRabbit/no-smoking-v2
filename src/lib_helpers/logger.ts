import logger from "../logger";
import { ContentProps } from "../content";
import { User } from "../db";
import { secToDateTime, tsToDateTime } from "./luxon";

type UserKeys = keyof User;

export const logWithTimestamps = (msg: string, contentProps?: ContentProps) => {
  if (logger.level !== "debug") {
    return;
  }
  const msgParts: string[] = [msg];
  const keysToTransformTimestampToTime: UserKeys[]= ["lastTime", "nextTime"];
  const keysToTransformSecondsToTime: UserKeys[]= ["tgLastCallTime"];
  Object.entries(contentProps || {})
    .forEach(([k, v]) => {
      if (keysToTransformTimestampToTime.includes(k as UserKeys)) {
        const date = tsToDateTime(v);
        msgParts.push(`${k} = "${date}"`);
        return;
      }
      if (keysToTransformSecondsToTime.includes(k as UserKeys)) {
        const date = secToDateTime(v);
        msgParts.push(`${k} = "${date}"`);
        return;
      }
      msgParts.push(`${k} = "${v}"`);
    });
  logger.debug(msgParts.join(", "), contentProps);
};