import { useContext } from "react";
import { DailyRewardContext } from "../context/DailyRewardContext";
export function useDailyRewardState() {
  const ctx = useContext(DailyRewardContext);
  if (!ctx) {
    throw new Error("useDailyRewardState must be used within DailyRewardProvider");
  }
  return ctx;
}