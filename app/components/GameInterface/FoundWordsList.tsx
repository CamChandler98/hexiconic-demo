import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { Colors } from "@/theme/colors";
import { AppText } from "../General/ui/AppText";

type FoundWordsModalProps = {
  visible: boolean;
  onClose: () => void;
  words: string[];
  wordScores?: Record<string, number>;
};

export const FoundWordsModal = ({
  visible,
  onClose,
  words,
  wordScores = {},
}: FoundWordsModalProps) => {
  const closeSound = useSoundEffect(SoundEffects.ui.close);
  const closingRef = useRef(false);
  const { height: windowHeight } = useWindowDimensions();
  const listMaxHeight = Math.min(360, Math.max(160, windowHeight * 0.45));

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(16)).current;
  const cardScale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    if (!visible) return;

    closingRef.current = false;
    backdropOpacity.setValue(0);
    cardOpacity.setValue(0);
    cardTranslateY.setValue(16);
    cardScale.setValue(0.98);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [backdropOpacity, cardOpacity, cardScale, cardTranslateY, visible]);

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;

    closeSound.play();

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 10,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onClose();
      closingRef.current = false;
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose} // Android back button
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <View style={styles.backdropPressable}>
          <Pressable
            onPress={handleClose}
            style={StyleSheet.absoluteFillObject}
          />
          <Animated.View
            style={{
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
            }}
          >
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <View>
                  <AppText variant="cardTitle" style={styles.title}>
                    Found Words
                  </AppText>
                  <AppText variant="bodySmall" style={styles.subtitle}>
                    Words discovered this round
                  </AppText>
                </View>

                <View style={styles.countBadge}>
                  <AppText variant="label" style={styles.countBadgeText}>
                    {words.length}
                  </AppText>
                </View>
              </View>

              <View style={[styles.list, { maxHeight: listMaxHeight }]}>
                <View style={styles.listHeader}>
                  <AppText variant="label" style={styles.listHeaderWord}>
                    Word
                  </AppText>
                  <AppText variant="label" style={styles.listHeaderScore}>
                    Pts
                  </AppText>
                </View>

                <ScrollView
                  style={styles.listScroll}
                  contentContainerStyle={styles.listContent}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {words.length === 0 ? (
                    <View style={styles.emptyState}>
                      <AppText
                        variant="bodySmall"
                        style={styles.emptyStateText}
                      >
                        No words found yet.
                      </AppText>
                    </View>
                  ) : (
                    words.map((item, index) => (
                      <View style={styles.wordRow} key={`${item}-${index}`}>
                        <View style={styles.wordIndexPill}>
                          <AppText variant="label" style={styles.wordIndexText}>
                            {index + 1}
                          </AppText>
                        </View>

                        <AppText variant="body" style={styles.wordText}>
                          {item.toUpperCase()}
                        </AppText>

                        <AppText variant="statMedium" style={styles.wordScore}>
                          {wordScores[item] ?? 0}
                        </AppText>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <AppText variant="buttonLabel" style={styles.closeButtonText}>
                  Close
                </AppText>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(20, 25, 40, 0.38)",
  },
  backdropPressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  card: {
    width: "92%",
    minWidth: 300,
    maxWidth: 460,
    // maxHeight: "80%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.default,
    backgroundColor: Colors.background.surface,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 9,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  title: {
    color: Colors.text.primary,
  },
  subtitle: {
    color: Colors.text.secondary,
    marginTop: 2,
  },
  countBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.interactive.primary,
    paddingHorizontal: 10,
  },
  countBadgeText: {
    color: "#fff",
    includeFontPadding: false,
  },
  list: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.subtle,
    marginBottom: 12,
    minHeight: 110,
    flexShrink: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: Colors.border.subtle,
  },
  listHeaderWord: {
    color: Colors.text.muted,
  },
  listHeaderScore: {
    color: Colors.text.muted,
    minWidth: 36,
    textAlign: "right",
  },
  listScroll: {
    width: "100%",
    flexGrow: 0,
  },
  listContent: {
    paddingVertical: 8,
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 26,
  },
  emptyStateText: {
    color: Colors.text.muted,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  wordIndexPill: {
    minWidth: 30,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  wordIndexText: {
    color: Colors.text.muted,
    includeFontPadding: false,
  },
  wordText: {
    color: Colors.text.primary,
    letterSpacing: 0.3,
    flex: 1,
  },
  wordScore: {
    color: Colors.interactive.primary,
    minWidth: 42,
    textAlign: "right",
  },
  closeButton: {
    marginTop: 14,
    alignSelf: "center",
    minWidth: 130,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.interactive.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  closeButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  closeButtonText: {
    color: "#fff",
    includeFontPadding: false,
  },
});

export default FoundWordsModal;
