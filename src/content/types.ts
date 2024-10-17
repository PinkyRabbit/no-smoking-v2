import { Content, Motivizer, BTN } from "../constants";

export type MultilineContent = { [key in Content]: string };
export type ContentProps = Record<string, unknown>;
export type TMotivizer = typeof Motivizer;

export type ButtonOption = { text: string; callback_data: BTN };
export type ButtonLine = ButtonOption[];
export type InlineKeyboard = ButtonLine[];
export type ButtonNames = { [key in BTN]: string };

