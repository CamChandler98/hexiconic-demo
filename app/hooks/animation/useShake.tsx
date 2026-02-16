import { useRef } from "react";
import { Animated, Easing } from "react-native";

type ShakeOptions = {
  frequency?: number;
  distance?: number;
  fadeTo?: number;
};

export function useShakeAnimation({
  frequency = 2,
  distance = 8,
  fadeTo = 0.2,
}: ShakeOptions = {}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const shake = () => {
    translateX.setValue(0);
    opacity.setValue(1);

    const shakes = [];

    for (let i = 0; i < frequency; i++) {
      shakes.push(
        Animated.timing(translateX, {
          toValue: distance,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -distance,
          duration: 40,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel([
      Animated.sequence([
        ...shakes,
        Animated.timing(translateX, {
          toValue: 0,
          duration: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: fadeTo,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return {
    shake,
    animatedStyle: {
      transform: [{ translateX }],
      opacity,
    },
  };
}