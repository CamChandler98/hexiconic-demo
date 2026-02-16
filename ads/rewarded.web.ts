export function createRewardedAd(
  _onLoaded: () => void,
  _onReward: () => void,
  _onClosed: () => void
) {
  return {
    show: () => Promise.resolve(),
    load: () => {},
    cleanup: () => {},
  };
}
