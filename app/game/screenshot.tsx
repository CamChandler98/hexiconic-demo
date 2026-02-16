import { GameInterfaceContainer } from "@/app/components/GameInterface/GameInterfaceContainer";
import { Layout } from "@/theme/layout";
import { Puzzle } from "@/types/puzzle";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Animated, BackHandler, Easing, Platform, View } from "react-native";

const SCREENSHOT_PUZZLE: Puzzle = {
  id: 1,
  baseword: "hexiconic",
  center: "h",
  letters: ["c", "e", "h", "i", "n", "o", "x"],
  subwords: {
    chi: 1,
    chic: 4,
    chichi: 6,
    chico: 5,
    chin: 4,
    chinch: 6,
    chine: 5,
    chino: 5,
    choice: 6,
    chon: 4,
    cinch: 5,
    cochin: 6,
    coho: 4,
    conch: 5,
    cooch: 5,
    eche: 4,
    echo: 4,
    heh: 1,
    heinie: 6,
    hen: 1,
    hence: 5,
    hex: 1,
    hexiconic: 19,
    hic: 1,
    hie: 1,
    hin: 1,
    hon: 1,
    honcho: 6,
    hone: 4,
    hooch: 5,
    ich: 1,
    inch: 4,
    niche: 5,
    noh: 1,
    oho: 1,
    ooh: 1,
  },
  totalPoints: 144,
  subwordCount: 36,
  avgSubwordZipf: 2.968,
  medianSubwordZipf: 2.775,
  effortScore: 20.734,
  difficultyScore: 0.7689446649392024,
  globalLevelNumber: 2,
};

export default function GameScreenshotScreen() {
  const router = useRouter();
  const entryOpacity = useRef(new Animated.Value(0)).current;
  const entryScale = useRef(new Animated.Value(0.985)).current;

  useEffect(() => {
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
  }, [entryOpacity, entryScale]);

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

  return (
    <View style={Layout.screen}>
      <Animated.View
        style={{
          flex: 1,
          opacity: entryOpacity,
          transform: [{ scale: entryScale }],
        }}
      >
        <GameInterfaceContainer
          puzzle={SCREENSHOT_PUZZLE}
          forceMaxStreakLevel
          disableGameplayTutorial
        />
      </Animated.View>
    </View>
  );
}
