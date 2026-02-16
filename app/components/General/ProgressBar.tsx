import { useProgressPulseAnimation } from "@/app/hooks/animation/useProgressPulse";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Animated,
  DimensionValue,
  Easing,
  StyleSheet,
  TextStyle,
  View,
} from "react-native";
import { AppText } from "./ui/AppText";

export type ProgressBarHandle = {
  pop: () => void;
};

interface ProgressBarProps {
  current: number;
  total?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: object;
  labelStyle?: TextStyle; // Optional label style override.
  showLabel?: boolean;
  onAnimationComplete?: () => void;
}

export const ProgressBar = forwardRef<ProgressBarHandle, ProgressBarProps>(
  (
    {
      current,
      total = 0,
      height = 16, // Default height that keeps the label readable.
      color = "#4CAF50",
      backgroundColor = "#E0E0E0",
      style,
      labelStyle,
      onAnimationComplete,
      showLabel = false,
    },
    ref,
  ) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const prevPercentage = useRef(0);

    const percentage =
      total > 0 ? Math.min(1, Math.max(0, current / total)) : 0;

    const {
      pulse,
      animatedStyle: pulseStyle,
      glowStyle,
    } = useProgressPulseAnimation({ scaleTo: 1.03 });

    useImperativeHandle(ref, () => ({ pop: pulse }));

    useEffect(() => {
      const isMovingBackward = percentage < prevPercentage.current;
      if (isMovingBackward) {
        animatedWidth.setValue(percentage);
      } else {
        Animated.timing(animatedWidth, {
          delay: 120,
          toValue: percentage,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start(({ finished }) => {
          // Fire completion only after a finished forward animation.
          if (finished && onAnimationComplete) {
            onAnimationComplete();
          }
        });
      }
      prevPercentage.current = percentage;
    }, [percentage, onAnimationComplete]);

    return (
      <Animated.View style={[pulseStyle, style]}>
        <View style={styles.shadowWrapper}>
          <View style={[styles.container, { height, backgroundColor }]}>
            <View
              pointerEvents="none"
              style={[styles.innerShadow, { borderRadius: height / 2 }]}
            />
            {/* Progress Fill */}
            <Animated.View
              style={{
                height: "100%",
                width: animatedWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }) as DimensionValue,
                backgroundColor: color,
                borderRadius: height / 2,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
                elevation: 2,
              }}
            />

            {/* Glow overlay */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.glow,
                { backgroundColor: color, borderRadius: height / 2 },
                glowStyle,
              ]}
            />

            {/* Centered Label */}
            {showLabel && (
              <View style={styles.labelOverlay} pointerEvents="none">
                <AppText
                  style={[
                    styles.labelText,
                    { fontSize: height * 0.7 },
                    labelStyle,
                  ]}
                >
                  {current} / {total}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  },
);
ProgressBar.displayName = "ProgressBar";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center", // Vertically center the label.
  },
  glow: {
    position: "absolute",
    inset: 0,
  },
  labelOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    // Improve readability against partially filled backgrounds.
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shadowWrapper: {
    borderRadius: 999,

    // iOS shadow.
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    // Android shadow.
    elevation: 4,
  },

  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    opacity: 0.25,
  },
});
