import { createContext } from "react";
import { useDailyReward } from "../hooks/useDailyReward";
type DailyRewardContextValue = {
  isAvailable: boolean;
  isLoading: boolean;
  claimReward: () => Promise<void>;
};

export const DailyRewardContext =
  createContext<DailyRewardContextValue | null>(null);


  export function DailyRewardProvider({ children }: { children: React.ReactNode }) {
  const reward = useDailyReward();
  return (
    <DailyRewardContext.Provider value={reward}>
      {children}
    </DailyRewardContext.Provider>
  );
}