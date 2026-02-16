import { updatePuzzleProgress } from "@/app/Utility/savedata";
import {
  COMPLETION_SCALE_EASE_OUT_AT,
  COMPLETION_SCALE_MAX_REDUCTION,
  COMPLETION_SCALE_TOTAL_PUZZLES,
  EARLY_LEVEL_COMPLETION_MULTIPLIER,
  EARLY_SUBWORD_COMPLETION_BASELINE,
  EARLY_SUBWORD_COMPLETION_EASE_OUT_AT,
  EARLY_SUBWORD_COMPLETION_MAX_REDUCTION,
  EARLY_SUBWORD_COMPLETION_RANGE,
} from "@/constants/Constants";
import { router } from "expo-router";

export async function goCompletion(puzzleId: number) {
  // Mark puzzle complete (idempotent)
  await updatePuzzleProgress(puzzleId, (entry) => ({
    ...entry,
    completed: true,
  }));

  router.push("/continue");
}

// Utility/scalingCompletion.ts

export function getCompletionScalingFactor(
  globalLevelIndex: number,
  totalPuzzles: number = COMPLETION_SCALE_TOTAL_PUZZLES,
  maxReduction = COMPLETION_SCALE_MAX_REDUCTION,
  easeOutAt = COMPLETION_SCALE_EASE_OUT_AT,
) {
  // Clamp safety
  const i = Math.max(1, Math.min(globalLevelIndex, totalPuzzles));

  // Normalized progress (0 → 1 over early curve only)
  const t = Math.min(i / easeOutAt, 1);

  // Smooth easing (fast early, slow later)
  // easeOutCubic
  const eased = 1 - Math.pow(1 - t, 3);

  // Reduction goes from maxReduction → 0
  const reduction = maxReduction * (1 - eased);

  // Final multiplier
  return 1 - reduction;
}

const EARLY_LEVEL_HINT_COST: Record<number, number> = {
  1: 2,
  2: 3,
  3: 4,
};

const EARLY_LEVEL_REROLL_COST: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getEarlySubwordCompletionMultiplier(
  subwordCount: number,
  globalLevelIndex: number,
): number {
  const safeSubwordCount = Math.max(0, subwordCount);
  const safeLevel = Math.max(1, globalLevelIndex);
  const levelWindow = Math.max(EARLY_SUBWORD_COMPLETION_EASE_OUT_AT - 1, 1);
  const levelProgress = clamp((safeLevel - 1) / levelWindow, 0, 1);
  const earlyWeight = 1 - levelProgress;

  const safeRange = Math.max(EARLY_SUBWORD_COMPLETION_RANGE, 1);
  const subwordPressure = clamp(
    (safeSubwordCount - EARLY_SUBWORD_COMPLETION_BASELINE) / safeRange,
    0,
    1,
  );

  const maxReduction = clamp(EARLY_SUBWORD_COMPLETION_MAX_REDUCTION, 0, 1);
  const reduction = maxReduction * earlyWeight * subwordPressure;

  return 1 - reduction;
}

export function getCompletionScore(
  totalPoints: number,
  completionThreshold: number,
  globalLevelIndex: number,
  subwordCount: number = 0,
): number {
  const scale = getCompletionScalingFactor(globalLevelIndex);
  const earlyMultiplier =
    EARLY_LEVEL_COMPLETION_MULTIPLIER[globalLevelIndex] ?? 1;
  const earlySubwordMultiplier = getEarlySubwordCompletionMultiplier(
    subwordCount,
    globalLevelIndex,
  );

  return Math.max(
    1,
    Math.ceil(
      totalPoints *
        completionThreshold *
        scale *
        earlyMultiplier *
        earlySubwordMultiplier,
    ),
  );
}

export function getHintLetterCost(
  globalLevelIndex: number,
  defaultCost: number,
): number {
  return EARLY_LEVEL_HINT_COST[globalLevelIndex] ?? defaultCost;
}

export function getRerollCost(
  globalLevelIndex: number,
  defaultCost: number,
): number {
  return EARLY_LEVEL_REROLL_COST[globalLevelIndex] ?? defaultCost;
}
