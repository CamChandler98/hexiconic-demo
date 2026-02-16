import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { AppText } from "../General/ui/AppText";

export const StartTitle = () => {
  const floatValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   const floatLoop = Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(floatValue, {
  //         toValue: 1,
  //         duration: 2200,
  //         easing: Easing.inOut(Easing.sin),
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(floatValue, {
  //         toValue: 0,
  //         duration: 2200,
  //         easing: Easing.inOut(Easing.sin),
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //   );

  //   const pulseLoop = Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(pulseValue, {
  //         toValue: 1,
  //         duration: 1800,
  //         easing: Easing.inOut(Easing.quad),
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(pulseValue, {
  //         toValue: 0,
  //         duration: 1800,
  //         easing: Easing.inOut(Easing.quad),
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //   );

  //   floatLoop.start();
  //   pulseLoop.start();

  //   return () => {
  //     floatLoop.stop();
  //     pulseLoop.stop();
  //   };
  // }, [floatValue, pulseValue]);

  const titleTranslateY = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const titleScale = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015],
  });

  const pillOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={{
          transform: [{ translateY: titleTranslateY }, { scale: titleScale }],
        }}
      >
        <AppText style={[Typography.screenTitle, styles.title]}>
          Hexiconic
        </AppText>
      </Animated.View>

      <AppText variant="bodySmall" style={styles.tagline}>
        Build as many words as you can!
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 34,
    width: "100%",
    maxWidth: 380,
  },
  title: {
    marginBottom: 8,
    fontSize: 50,
    lineHeight: 56,
    letterSpacing: -1.1,
    color: Colors.text.primary,
    textShadowColor: "rgba(0,0,0,0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  pill: {
    backgroundColor: Colors.gem.pink,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 10,
  },
  pillText: {
    color: Colors.text.secondary,
    letterSpacing: 0.9,
  },
  tagline: {
    textAlign: "center",
    color: Colors.text.secondary,
    lineHeight: 20,
    maxWidth: 320,
  },
});
