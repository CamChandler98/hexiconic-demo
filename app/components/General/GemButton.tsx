import { TouchableOpacity, View } from "react-native";

const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 50;

export const GemButton = ({
  color,
  children,
  onPress,
  disabled = false,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: {
  color: string;
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ marginHorizontal: 8, opacity: disabled ? 0.55 : 1 }}
    >
      <View
        style={{
          width,
          height,
          borderRadius: height / 3, // keeps the rounded feel proportional
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // Required for internal absolute-positioned overlays.
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};
