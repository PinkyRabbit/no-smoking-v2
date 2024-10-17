import { Content, Motivizer } from "../constants";

export type MultilineContent = { [key in Content]: string };
export type ContentProps = Record<string, unknown>;
export type TMotivizer = typeof Motivizer;

