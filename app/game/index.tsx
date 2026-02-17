import { usePuzzleContext } from "@/app/context/PuzzleContext"; // Import hook
import { Layout } from "@/theme/layout";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { GameInterfaceContainer } from "../components/GameInterface/GameInterfaceContainer";
import { ScreenFooter } from "../components/General/ScreenFooter";

export default function GameScreen() {
  // 1. Get the puzzle directly from context
  const { currentPuzzle } = usePuzzleContext();
  const router = useRouter();

  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryScale = useRef(new Animated.Value(0.985)).current;

  useEffect(() => {
    if (!currentPuzzle) return;

    entryOpacity.setValue(0);
    entryScale.setValue(0.985);

    Animated.parallel([
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(entryScale, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentPuzzle, entryOpacity, entryScale]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return undefined;

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          router.replace("/start");
          return true;
        },
      );

      return () => {
        subscription.remove();
      };
    }, [router]),
  );

  // 2. Safety Check: If no puzzle is set (e.g. user reloaded app on this screen),
  // redirect them back to the menu so they can pick one.
  if (!currentPuzzle) {
    return <Redirect href="/start" />;
  }

  // 3. Render directly using the object
  return (
    <View style={Layout.screen}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: entryOpacity,
            transform: [{ scale: entryScale }],
          },
        ]}
      >
        <GameInterfaceContainer puzzle={currentPuzzle} />
        <ScreenFooter />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
