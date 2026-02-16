import { useShakeAnimation } from "@/app/hooks/animation/useShake";
import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { adjustColor } from "@/app/Utility/ui";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Animated } from "react-native";
import { AppText } from "../General/ui/AppText";

export type InputWordHandle = {
  error: () => void;
};

type InputWordContainerProps = {
  word: string;
  centerLetter: string;
  centerLetterColor: string;
};

export const InputWordContainer = forwardRef<
  InputWordHandle,
  InputWordContainerProps
>(({ word, centerLetter, centerLetterColor }, ref) => {
  const letters = [...word];
  const isEmpty = letters.length === 0;
  const normalizedCenterLetter = centerLetter.toLowerCase();

  const streakTextColor = adjustColor(centerLetterColor, {
    saturate: 0.25,
    lighten: -0.25,
  });

  // --- Blinking Caret Logic ---
  const caretOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isEmpty) {
      // Create a looping blink animation
      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(caretOpacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(caretOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      );

      blink.start();

      // Cleanup: stop animation when component unmounts or isEmpty changes
      return () => {
        blink.stop();
        caretOpacity.setValue(0);
      };
    }
  }, [isEmpty, caretOpacity]);

  // --- Shake Animation ---
  const { shake, animatedStyle } = useShakeAnimation({
    frequency: 2,
  });

  const failSound = useSoundEffect(SoundEffects.validate.fail.soft, {
    volume: 0.6,
  });

  useImperativeHandle(ref, () => ({
    error: () => {
      failSound.play();
      shake();
    },
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          minHeight: 38,
          alignItems: "center",
          marginBottom: 15,
        },
        animatedStyle,
      ]}
    >
      {isEmpty ? (
        <Animated.View style={{ opacity: caretOpacity }}>
          <AppText variant="inputLetter" style={{ marginHorizontal: 2 }}>
            |
          </AppText>
        </Animated.View>
      ) : (
        letters.map((char, index) => (
          <AppText
            key={index}
            variant="inputLetter"
            style={[
              { marginHorizontal: 2 },
              char.toLowerCase() === normalizedCenterLetter && {
                color: streakTextColor,
                textShadowColor: "rgba(0,0,0,0.25)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              },
            ]}
          >
            {char.toUpperCase()}
          </AppText>
        ))
      )}
    </Animated.View>
  );
});

InputWordContainer.displayName = "InputWordContainer";
