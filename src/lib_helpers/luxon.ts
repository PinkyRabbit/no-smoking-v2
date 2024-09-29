import { DateTime } from "luxon";

export const timestampToTime = (timestamp: number) => {
  const date = DateTime.fromSeconds(timestamp);
  return date.toFormat("HH:mm");
};

export const dateTimeToTime = () => {
  return DateTime.now().toFormat("HH:mm");
};
