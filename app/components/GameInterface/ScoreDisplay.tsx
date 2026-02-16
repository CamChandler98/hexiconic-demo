import { View } from "react-native";
import { AppText } from "../General/ui/AppText";
export const ScoreDisplay = ({ score }: { score: number }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <AppText  style={{ fontSize: 24 }}>{score}</AppText>
    </View>
  );
};