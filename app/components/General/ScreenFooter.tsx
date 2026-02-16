import { Colors } from "@/theme/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { AppText } from "./ui/AppText";

const GRID_FOOTER_WIDTH = 240;

type ScreenFooterProps = {
  style?: StyleProp<ViewStyle>;
  width?: number;
};

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
          <FontAwesome6 name="github" size={28} color="#24292e" />
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
          <FontAwesome6 name="globe" size={26} color={Colors.gem.pink} />
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
    height: 56,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
    // marginBottom: 30,
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
