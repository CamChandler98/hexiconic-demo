import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type StaggerOptions = {
  enabled?: boolean;
  riseDistance?: number;
  duration?: number;
  stagger?: number;
};

export function useStaggeredRiseIn(
  count: number,
  {
    enabled = true,
    riseDistance = 12,
    duration = 260,
    stagger = 40,
  }: StaggerOptions = {}
) {
  const animations = useRef(
    Array.from({ length: count }, () => ({
      translateY: new Animated.Value(riseDistance),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const play = useCallback(() => {
    const sequence = animations.map(({ translateY, opacity }) => {
      translateY.stopAnimation();
      opacity.stopAnimation();
      translateY.setValue(riseDistance);
      opacity.setValue(0);

      return Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(stagger, sequence).start();
  }, [animations, duration, riseDistance, stagger]);

  useEffect(() => {
    if (!enabled) return;

    play();
  }, [enabled, play]);

  return animations.map(({ translateY, opacity }) => ({
    transform: [{ translateY }],
    opacity,
  }));
}
