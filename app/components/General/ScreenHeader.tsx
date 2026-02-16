import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BackButton } from "./BackButton";
import OptionsButtonRaw from "./OptionsButton";
import { OptionsModal } from "./OptionsModal"; // adjust path
import { AppText } from "./ui/AppText";

type ScreenHeaderProps = {
  title?: string;
  rightSlot?: React.ReactNode; // hints, currency, etc.
  backEnabled?: boolean;
};

export const ScreenHeader = ({
  title,
  rightSlot,
  backEnabled = true,
}: ScreenHeaderProps) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  return (
    <>
      <View style={styles.container}>
        {/* LEFT */}
        {backEnabled ? (
          <View style={styles.left}>
            <BackButton />
          </View>
        ) : (
          <View style={styles.left} />
        )}

        {/* CENTER */}
        <View style={styles.center}>
          {title && (
            <AppText variant="sectionTitle" numberOfLines={1}>
              {title}
            </AppText>
          )}
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <View style={styles.rightRow}>
            {rightSlot ? (
              <View style={styles.rightSlot}>{rightSlot}</View>
            ) : null}
            <OptionsButtonRaw
              onPress={() => {
                setOptionsOpen(true);
              }}
            />
          </View>
        </View>
      </View>

      <OptionsModal
        visible={optionsOpen}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 20,
    width: "100%",
    opacity: 1,
  },

  left: {
    width: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  right: {
    minWidth: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rightSlot: {
    marginRight: 10,
  },
});
