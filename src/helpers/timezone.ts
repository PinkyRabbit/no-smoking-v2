export function isValidTimezoneCheck(timezone: string): boolean {
  const timezoneRegex = /^(UTC|GMT)([+-])(?:1[0-4]|0?[0-9])(?::?[0-5][0-9])?$/i;
  return timezoneRegex.test(timezone);
}