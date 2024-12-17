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

export const stepByDifficulty = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case Difficulty.HARD:
      return 2;
    case Difficulty.MEDIUM:
      return 1;
    case Difficulty.EASY:
    default:
      return 0.5;
  }
};

export const penaltyByDifficulty = (difficulty: Difficulty, penalty: number): number => {
  if (difficulty === Difficulty.EASY) {
    return 0;
  }
  if (difficulty === Difficulty.MEDIUM) {
    return 0.5 * penalty;
  }
  let hardLevelValue = 0;
  for(let i = 0; i < penalty; i += 1) {
    const step = hardLevelValue + 0.5;
    hardLevelValue += step;
  }
  return hardLevelValue;
};
