import { loadProgress, updatePuzzleProgress } from "@/app/Utility/savedata";
import {
  GemTierColors,
  GemTierLabels,
  TIER_KEYS,
  TierKey,
} from "@/constants/Constants";
import { useCallback, useEffect, useRef, useState } from "react";

type StreakStatus = "initiated" | "maintained" | "broken" | "building" | "none";

type StreakUpdateResult = {
  status: StreakStatus;
  streakNumber: number;
  hasStreak: boolean;
  streakProgressName: string;
  streakProgressColor: string;
  tier: TierKey;
};

type UseWordStreakOptions = {
  forceMaxStreakLevel?: boolean;
};

const MAX_STREAK_COUNT = TIER_KEYS.length;

const getTierKey = (count: number): TierKey => {
  if (count < 2) return "Tier0";
  const tierIndex = Math.min(count - 1, 6);
  return `Tier${tierIndex}` as TierKey;
};

const toResult = (status: StreakStatus, count: number): StreakUpdateResult => {
  const hasStreak = count >= 2;
  const tierKey = getTierKey(count);

  return {
    status,
    streakNumber: hasStreak ? count - 1 : 0,
    hasStreak,
    streakProgressName: GemTierLabels[tierKey],
    streakProgressColor: GemTierColors[tierKey],
    tier: tierKey,
  };
};

export const useWordStreak = (
  puzzleId: number,
  options: UseWordStreakOptions = {},
) => {
  const forcedCount = options.forceMaxStreakLevel ? MAX_STREAK_COUNT : null;

  const consecutiveCountRef = useRef(forcedCount ?? 0);
  const [consecutiveCount, setConsecutiveCount] = useState(forcedCount ?? 0);

  useEffect(() => {
    if (forcedCount != null) {
      consecutiveCountRef.current = forcedCount;
      setConsecutiveCount(forcedCount);
      return;
    }

    async function load() {
      const map = await loadProgress();
      const saved = map[puzzleId];

      if (saved?.streakCount != null) {
        consecutiveCountRef.current = saved.streakCount;
        setConsecutiveCount(saved.streakCount);
      }
    }
    load();
  }, [puzzleId, forcedCount]);

  const persistStreak = useCallback(
    (count: number) => {
      if (forcedCount != null) return;
      // console.log("attempting to save streak to local storage");
      // console.log("streak number ", count);
      updatePuzzleProgress(puzzleId, (entry) => ({
        ...entry,
        streakCount: count,
      }));
    },
    [puzzleId, forcedCount],
  );

  const updateStreak = useCallback(
    (word: string): StreakUpdateResult => {
      const isQualifyingWord = word.length >= 4;

      if (!isQualifyingWord) {
        if (forcedCount != null) {
          return toResult("maintained", forcedCount);
        }

        consecutiveCountRef.current = 0;
        setConsecutiveCount(0);
        persistStreak(0);
        return toResult("broken", 0);
      }

      const next =
        forcedCount != null ? forcedCount : consecutiveCountRef.current + 1;
      consecutiveCountRef.current = next;
      setConsecutiveCount(next);
      // console.log("saving strreak");
      persistStreak(next);

      let status: StreakStatus =
        next === 1 ? "building" : next === 2 ? "initiated" : "maintained";
      if (forcedCount != null) {
        status = "maintained";
      }

      return toResult(status, next);
    },
    [forcedCount, persistStreak],
  );

  const resetStreak = useCallback(() => {
    if (forcedCount != null) {
      consecutiveCountRef.current = forcedCount;
      setConsecutiveCount(forcedCount);
      return;
    }

    consecutiveCountRef.current = 0;
    setConsecutiveCount(0);
    persistStreak(0);
  }, [forcedCount, persistStreak]);

  const effectiveCount = forcedCount ?? consecutiveCount;
  const tierKey = getTierKey(effectiveCount);

  return {
    hasStreak: effectiveCount >= 2,
    streakNumber: effectiveCount >= 2 ? effectiveCount - 1 : 0,
    streakProgressName: GemTierLabels[tierKey],
    streakProgressColor: GemTierColors[tierKey],
    tier: tierKey,
    updateStreak,
    resetStreak,
  };
};

export default useWordStreak;
