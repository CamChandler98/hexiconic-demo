import { RelativePathString, useRouter } from "expo-router";
import { TouchableOpacity, ViewStyle } from "react-native";
import { BackIcon } from "./ButtonIcons/BackIcon";
type BackButtonProps = {
  style?: ViewStyle;
  color?: string;
  destination?: RelativePathString;
};

export const BackButton = ({
  style,
  color = "#333",
  destination = '/' as RelativePathString
}: BackButtonProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.replace(destination)}
      hitSlop={12}
      style={[
        {
          padding: 8,
          borderRadius: 16,
          backgroundColor: "#ffffffcc", // subtle float
        },
        style,
      ]}
    >
      <BackIcon size={22} color={color} />
    </TouchableOpacity>
  );
};