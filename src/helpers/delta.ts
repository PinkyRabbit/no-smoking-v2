import { User } from "../db";
import { penaltyByDifficulty, stepByDifficulty } from "../helpers";

/**
 * Helper to calculate new delta time
 */
export const computeNewDelta = (
  {
    deltaTime,
    difficulty,
    penalty,
    minDeltaTime,
  }: Pick<User, "deltaTime" | "difficulty" | "penalty" | "minDeltaTime">,
  isTenMinPenalty?: boolean,
) => {
  if (isTenMinPenalty) {
    const newDeltaTime = deltaTime - 10;
    return newDeltaTime >= minDeltaTime ? newDeltaTime : minDeltaTime;
  }
  const deltaTimeInt = deltaTime * 10;
  const stepInt = stepByDifficulty(difficulty) * 10;
  const penaltyInt = penaltyByDifficulty(difficulty, penalty) * 10;
  const newDelta = (deltaTimeInt + stepInt - penaltyInt) / 10;
  return newDelta >= minDeltaTime ? newDelta : minDeltaTime;
};
