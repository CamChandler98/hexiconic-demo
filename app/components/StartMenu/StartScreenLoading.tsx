import { Colors } from "@/theme/colors";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const StartScreenLoading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.subtitle} />

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.buttonPlaceholder} />

        <ActivityIndicator size="small" color={Colors.interactive.primary} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem} />
        <View style={styles.footerItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  header: {
    height: 76,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.background.surfaceMuted,
  },
  headerRight: {
    width: 78,
    height: 34,
    borderRadius: 18,
    backgroundColor: Colors.gem.blue,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    width: 220,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background.surfaceMuted,
    marginBottom: 12,
  },
  subtitle: {
    width: 180,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.background.surfaceMuted,
    marginBottom: 20,
  },
  progressTrack: {
    width: "60%",
    minWidth: 220,
    maxWidth: 420,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E6E6E6",
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    width: "36%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: Colors.gem.pink,
  },
  buttonPlaceholder: {
    width: 120,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.interactive.secondary,
    marginBottom: 16,
  },
  footer: {
    height: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  footerItem: {
    width: 56,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.background.surfaceMuted,
  },
});
