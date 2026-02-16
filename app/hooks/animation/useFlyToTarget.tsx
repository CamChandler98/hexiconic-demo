import { AppText } from "@/app/components/General/ui/AppText";
import { useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";

type Point = { x: number; y: number };
type PlayOptions = {
  onComplete?: () => void;
};
type FlyOptions = {
  target: Point | null;
  color?: string;
  duration?: number;
  scaleTo?: number;
};

export function useFlyToTargetAnimation({
  target,
  color = "#333",
  duration = 600,
  scaleTo = 0.4,
}: FlyOptions) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [value, setValue] = useState<number | null>(null);

  const play = (
  amount: number,
  start: Point,
  options?: { onComplete?: () => void }
) => {
  if (!target) return;

  setValue(amount);

  translateX.setValue(start.x);
  translateY.setValue(start.y);
  scale.setValue(1);
  opacity.setValue(1);

  Animated.parallel([
    Animated.timing(translateX, {
      toValue: target.x,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: target.y,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(scale, {
      toValue: scaleTo,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }),
  ]).start(() => {
    setValue(null);
    options?.onComplete?.();
  });
};


  const AnimatedNode =
    value !== null ? (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.node,
          {
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
            opacity,
          },
        ]}
      >
        <AppText variant="sectionTitle" style={{ color }}>
          +{value}
        </AppText>
      </Animated.View>
    ) : null;

  return {
    play,
    AnimatedNode,
  };
}

const styles = StyleSheet.create({
  node: {
    position: "absolute",
    zIndex: 999,
  },
});
