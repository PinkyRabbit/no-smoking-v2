import { Content, Difficulty, Lang } from "../constants";
import { getContent } from "../content";

export const difficultyNameByLevel = (lang: Lang, difficulty: Difficulty): string => {
  switch (difficulty) {
    case Difficulty.EASY:
      return getContent(lang, Content.DIFFICULTY_EASY);
    case Difficulty.MEDIUM:
      return getContent(lang, Content.DIFFICULTY_MEDIUM);
    case Difficulty.HARD:
      return getContent(lang, Content.DIFFICULTY_HARD);
  }
  return "Unknown";
};