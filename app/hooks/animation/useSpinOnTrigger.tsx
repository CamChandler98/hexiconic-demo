import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";

type UseSpinOnTriggerArgs = {
  enabled: boolean;
  trigger: any; // typically a boolean or a number "animationKey"
  duration?: number;
};

export function useSpinOnTrigger({
  enabled,
  trigger,
  duration = 800,
}: UseSpinOnTriggerArgs) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    spinValue.stopAnimation(); // prevents stacking
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [enabled, trigger, duration, spinValue]);

  const rotate = useMemo(
    () =>
      spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      }),
    [spinValue]
  );

  // Return a ready-to-use style object
  const animatedStyle = useMemo(
    () => ({ transform: [{ rotate }] }),
    [rotate]
  );

  return { animatedStyle };
}
