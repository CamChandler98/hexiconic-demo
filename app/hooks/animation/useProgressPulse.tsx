import { useRef } from "react";
import { Animated, Easing } from "react-native";

type PulseOptions = {
  scaleTo?: number;
  glowTo?: number;
  duration?: number;
};

export function useProgressPulseAnimation({
  scaleTo = 1.06,
  glowTo = 0.35,
  duration = 180,
}: PulseOptions = {}) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const pulse = () => {
    scale.setValue(1);
    glow.setValue(0);

    Animated.parallel([
      // Scale pop
      Animated.sequence([
        Animated.timing(scale, {
          toValue: scaleTo,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // Glow flash
      Animated.sequence([
        Animated.timing(glow, {
          toValue: glowTo,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: duration * 1.2,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return {
    pulse,
    animatedStyle: {
      transform: [{ scale }],
    },
    glowStyle: {
      opacity: glow,
    },
  };
}
