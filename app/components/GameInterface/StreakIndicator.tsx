import { CornerBadge } from "@/app/components/General/CornerBadge";
import { AppText } from "@/app/components/General/ui/AppText";
import { adjustColor } from "@/app/Utility/ui";
import { Colors } from "@/theme/colors";
import { View, ViewStyle } from "react-native";
import { FlameIcon } from "../General/ButtonIcons/GemFlameIcon";
type StreakIndicatorProps = {
  hasStreak: boolean;
  streakNumber: number;

  // Color options for the streak badge icon.
  streakColor?: string;
  outerFill?: string;
  innerFill?: string;

  // Icon and badge sizing.
  iconSize?: number;
  badgeSize?: number;

  // Badge offset relative to the icon wrapper.
  badgeOffsetX?: number;
  badgeOffsetY?: number;

  // Optional layout overrides.
  style?: ViewStyle;
  showWhenZero?: boolean; // Prevents layout shift by keeping the badge mounted.
};

export const StreakIndicator = ({
  hasStreak,
  streakNumber,
  streakColor = "#FF7A18",
  outerFill = "#FF7A18",
  innerFill = "#FFD36A",
  iconSize = 100,
  badgeSize = 100,
  badgeOffsetX = -6,
  badgeOffsetY = 4,
  style,
  showWhenZero = false,
}: StreakIndicatorProps) => {
  const visible = showWhenZero ? true : hasStreak;
  if (!visible) return null;

  return (
    <View
      style={[
        {
          position: "relative",
          // No fixed width/height so the badge can expand horizontally.
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <CornerBadge
        visible={hasStreak || showWhenZero}
        offsetY={badgeOffsetY}
        offsetX={badgeOffsetX}
        size={badgeSize}
        style={{
          backgroundColor: Colors.background.surfaceMuted,
          position: "relative", // Override CornerBadge absolute positioning.
          bottom: undefined, // Clear default corner placement.
          right: undefined,
          flexDirection: "row", // Keep icon and text side-by-side.
          alignItems: "center",
          gap: 2,
          elevation: 5,
          padding: 20,
        }}
      >
        <FlameIcon
          size={iconSize}
          strokeWidth={0}
          lightFill={
            hasStreak
              ? adjustColor(outerFill, { saturate: 1, lighten: -0.2 })
              : "none"
          }
          darkFill={
            hasStreak
              ? adjustColor(innerFill, { saturate: 0.2, lighten: -0.2 })
              : "none"
          }
        />

        <AppText
          variant="statMedium"
          style={{
            color: Colors.text.primary,
            includeFontPadding: false, // Tighten Android text metrics.
            textAlignVertical: "center",
          }}
        >
          {Math.max(0, streakNumber) + "x"}
        </AppText>
      </CornerBadge>
    </View>
  );
};
export default StreakIndicator;
