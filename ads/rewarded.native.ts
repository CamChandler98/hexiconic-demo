import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

export function createRewardedAd(
  onLoaded: () => void,
  onReward: () => void,
  onClosed: () => void
) {
  const ad = RewardedAd.createForAdRequest(TestIds.REWARDED);

  const unsubLoaded = ad.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      onLoaded();
    }
  );

  const unsubReward = ad.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    () => {
      onReward();
    }
  );

  // ✅ THIS is the missing piece
  const unsubClosed = ad.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      onClosed();
      ad.load(); // preload next ad
    }
  );

  ad.load();

  return {
    show: () => ad.show(),
    load: () => ad.load(),
    cleanup: () => {
      unsubLoaded();
      unsubReward();
      unsubClosed();
    },
  };
}
