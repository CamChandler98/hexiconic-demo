import { useCurrency } from "@/app/context/CurrencyContext";
import { StyleSheet, View } from "react-native";
import { GemHintIcon } from "./ButtonIcons/GemHintIcon";
import { AppText } from "./ui/AppText";
type GemCounterProps = {
  size?: number;
};

export const GemCounter = ({ size = 28 }: GemCounterProps) => {
  const { gems } = useCurrency();

  return (
    <View style={styles.container}>
      <GemHintIcon size={size} />
      <AppText style={styles.text}>
        {gems}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // RN 0.71+ (otherwise replace with margin)
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});