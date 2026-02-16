import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

type CornerBadgeProps = {
  visible?: boolean;
  children?: ReactNode;

  // positioning
  offsetX?: number;
  offsetY?: number;

  // sizing
  size?: number;

  // style overrides
  backgroundColor?: string;
  style?: ViewStyle;
};

export function CornerBadge({
  visible = true,
  children,
  offsetX = -4,
  offsetY = -4,
  size = 18,
  backgroundColor = "#FFFFFF",
  style,
}: CornerBadgeProps) {
  if (!visible) return null;

  return (
    <View
      style={[
        {
          position: "absolute",
          bottom: offsetY,
          right: offsetX,

          minWidth: size,
          height: size,
          paddingHorizontal: 4,
          borderRadius: Math.ceil(size / 3),

          backgroundColor,

          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",

          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 1 },
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
