import { createRewardedAd } from "@/ads";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

// Update arguments to accept an optional onClosed callback
export function useRewardedAd(onReward: () => void, onClosed?: () => void) {
  const adRef = useRef<{
    show: () => Promise<unknown> | void;
    cleanup: () => void;
    load?: () => void;
  } | null>(null);
  const onRewardRef = useRef(onReward);
  const onClosedRef = useRef(onClosed);
  const showingRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    onRewardRef.current = onReward;
  }, [onReward]);

  useEffect(() => {
    onClosedRef.current = onClosed;
  }, [onClosed]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    setLoaded(false);
    adRef.current = createRewardedAd(
      () => setLoaded(true),
      () => {
        onRewardRef.current();
      },
      () => {
        showingRef.current = false;
        setShowing(false);
        setLoaded(false);
        onClosedRef.current?.();
      }
    );

    return () => {
      showingRef.current = false;
      adRef.current?.cleanup();
      adRef.current = null;
    };
  }, []);

  const showAd = useCallback(() => {
    if (!loaded || showingRef.current || !adRef.current) return;

    showingRef.current = true;
    setShowing(true);
    setLoaded(false);

    Promise.resolve(adRef.current.show()).catch((error) => {
      console.warn("Rewarded ad failed to show", error);
      showingRef.current = false;
      setShowing(false);
      setLoaded(false);
      adRef.current?.load?.();
    });
  }, [loaded]);

  return {
    loaded,
    showing,
    showAd,
  };
}
