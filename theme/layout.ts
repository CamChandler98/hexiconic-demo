import { StyleSheet } from "react-native";
import { Colors } from "./colors";

export const Layout = StyleSheet.create({
  screen: {
    paddingTop: 30,
    marginTop: 0,
    flex: 1,
    backgroundColor: Colors.background.base,
  },

  paddedScreen: {
    flex: 1,
    backgroundColor: Colors.background.base,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  card: {
    backgroundColor: Colors.background.surface,
    borderRadius: 16,
    padding: 16,
  },

  cardMuted: {
    backgroundColor: Colors.background.surfaceMuted,
    borderRadius: 16,
    padding: 16,
  },
});
