import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const DAILY_REWARD_KEY = "daily-reward-state";
const DAY_MS = 24 * 60 * 60 * 1000;

type DailyRewardState = {
  lastClaimedAt: number;
};

function isRewardAvailable(lastClaimedAt?: number) {
  if (!lastClaimedAt) return true;
  return Date.now() - lastClaimedAt >= DAY_MS;
}

export function useDailyReward() {
  const [lastClaimedAt, setLastClaimedAt] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // ─────────────────────────────
  // Load state on mount
  // ─────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const raw = await AsyncStorage.getItem(DAILY_REWARD_KEY);
        if (!mounted) return;

        if (raw) {
          const parsed: DailyRewardState = JSON.parse(raw);
          setLastClaimedAt(parsed.lastClaimedAt);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const available = !isLoading && isRewardAvailable(lastClaimedAt);

  // ─────────────────────────────
  // Claim reward
  // ─────────────────────────────
  const claimReward = useCallback(async () => {
    // console.log('useDailyRewardHook claiming reward')
    const now = Date.now();
    const state: DailyRewardState = { lastClaimedAt: now };

    await AsyncStorage.setItem(DAILY_REWARD_KEY, JSON.stringify(state));
    setLastClaimedAt(now);
  }, []);

  return {
    isLoading,
    isAvailable: available,
    lastClaimedAt,
    claimReward,
  };
}
