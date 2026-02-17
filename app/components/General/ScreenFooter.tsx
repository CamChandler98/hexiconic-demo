import { Colors } from "@/theme/colors";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { AppText } from "./ui/AppText";

const GRID_FOOTER_WIDTH = 240;

type ScreenFooterProps = {
  style?: StyleProp<ViewStyle>;
  width?: number;
};

type FooterIconProps = {
  size: number;
  color: string;
};

const GithubIcon = ({ size, color }: FooterIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 0.5C5.648 0.5 0.5 5.648 0.5 12c0 5.088 3.292 9.407 7.865 10.93c0.575 0.11 0.786-0.25 0.786-0.557c0-0.274-0.01-1.18-0.016-2.139c-3.2 0.696-3.876-1.542-3.876-1.542c-0.523-1.33-1.277-1.684-1.277-1.684c-1.044-0.713 0.079-0.699 0.079-0.699c1.156 0.081 1.765 1.186 1.765 1.186c1.026 1.758 2.693 1.25 3.349 0.956c0.104-0.743 0.401-1.25 0.729-1.537c-2.554-0.29-5.238-1.277-5.238-5.682c0-1.254 0.447-2.279 1.18-3.081c-0.119-0.289-0.511-1.457 0.111-3.037c0 0 0.962-0.308 3.152 1.176C10.033 6.599 11.007 6.47 12 6.466c0.993 0.004 1.968 0.133 2.889 0.393c2.188-1.484 3.148-1.176 3.148-1.176c0.624 1.58 0.232 2.748 0.114 3.037c0.734 0.802 1.178 1.827 1.178 3.081c0 4.416-2.688 5.389-5.249 5.674c0.413 0.355 0.781 1.053 0.781 2.121c0 1.532-0.014 2.766-0.014 3.142c0 0.311 0.207 0.673 0.792 0.557C20.211 21.404 23.5 17.086 23.5 12C23.5 5.648 18.352 0.5 12 0.5Z"
    />
  </Svg>
);

const GlobeIcon = ({ size, color }: FooterIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.75} fill="none" />
    <Path
      d="M3 12h18M12 3c2.6 2.6 3.75 5.89 3.75 9c0 3.11-1.15 6.4-3.75 9M12 3C9.4 5.6 8.25 8.89 8.25 12c0 3.11 1.15 6.4 3.75 9"
      stroke={color}
      strokeWidth={1.75}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

export const ScreenFooter = ({
  style,
  width = GRID_FOOTER_WIDTH,
}: ScreenFooterProps) => {
  const openLink = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.linkRow, { width }]}>
        <Pressable
          onPress={() => openLink("https://github.com/CamChandler98")}
          style={({ hovered, pressed }) => [
            styles.iconButton,
            (hovered || pressed) && styles.iconButtonActive,
          ]}
        >
          <GithubIcon size={28} color="#24292e" />
          <AppText variant="body" style={styles.iconLabel}>
            GitHub
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => openLink("https://camchandler98.github.io/")}
          style={({ hovered, pressed }) => [
            styles.iconButton,
            (hovered || pressed) && styles.iconButtonActive,
          ]}
        >
          <GlobeIcon size={26} color={Colors.gem.pink} />
          <AppText variant="body" style={styles.iconLabel}>
            Portfolio
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 88,
    paddingHorizontal: 25,
    paddingTop: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Platform.OS === "web" ? 28 : 14,
    marginTop: 8,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  iconButtonActive: {
    opacity: 0.7,
    transform: [{ scale: 1.05 }],
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
