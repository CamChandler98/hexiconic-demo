import { View } from "react-native";
import { AppText } from "../General/ui/AppText";
export const TierLabel = ({ label }: { label: string }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <AppText variant='label' style={{ fontSize: 18, marginBottom:45}}>{label}</AppText>
    </View>
  );
};