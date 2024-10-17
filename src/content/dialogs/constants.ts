export const B = "*";
export const I = "_";

const NEW_LINE_SYMBOL = "\\N";
export const NL = NEW_LINE_SYMBOL;
const NEW_LINE_DOUBLE = `${NEW_LINE_SYMBOL}${NEW_LINE_SYMBOL}`;
export const N2 = NEW_LINE_DOUBLE;
const NEW_LINE_DASH = `${NEW_LINE_SYMBOL}---${NEW_LINE_SYMBOL}`;
export const ND = NEW_LINE_DASH;

export const newLineRegexp = /\s?\\N\s?/g;