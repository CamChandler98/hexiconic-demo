import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { CurrencyProvider } from "./context/CurrencyContext";
import { DailyRewardProvider } from "./context/DailyRewardContext";
import { PuzzleProvider } from "./context/PuzzleContext"; // Import the provider
import { SoundSettingsProvider } from "./context/SoundSettingsContext";
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // or a splash / loading screen
  }
  return (
    <SoundSettingsProvider>
      <DailyRewardProvider>
        <PuzzleProvider>
          <CurrencyProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </CurrencyProvider>
        </PuzzleProvider>
      </DailyRewardProvider>
    </SoundSettingsProvider>
  );
}
