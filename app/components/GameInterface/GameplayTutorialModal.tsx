import { Colors } from "@/theme/colors";
import { Layout } from "@/theme/layout";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "../General/ui/AppText";

type GameplayTutorialModalProps = {
  visible: boolean;
  onSkip: () => void;
  onComplete: () => void;
};

const TUTORIAL_STEPS = [
  "Every valid word must include the center letter.",
  "Build a word from the letter tiles and tap Check to submit it.",
  "Hints reveal letters for gems, and you can earn gems by finding words or watching an ad.",
] as const;

export const GameplayTutorialModal = ({
  visible,
  onSkip,
  onComplete,
}: GameplayTutorialModalProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setStepIndex(0);
    }
  }, [visible]);

  const isLastStep = stepIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={onSkip}
        />

        <View style={[styles.card, Layout.cardMuted]}>
          <View style={styles.topRow}>
            <AppText variant="label">
              Tutorial {stepIndex + 1}/{TUTORIAL_STEPS.length}
            </AppText>

            <TouchableOpacity onPress={onSkip} hitSlop={10}>
              <AppText variant="bodySmall" style={styles.skipText}>
                Skip
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText variant="sectionTitle" style={styles.title}>
            Quick Guide
          </AppText>

          <AppText variant="body" style={styles.bodyText}>
            {TUTORIAL_STEPS[stepIndex]}
          </AppText>

          <TouchableOpacity onPress={handleNext} style={styles.primaryButton}>
            <AppText variant="buttonLabel" style={styles.primaryButtonText}>
              {isLastStep ? "Start Playing" : "Next"}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 24,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: Colors.background.surface,
    padding: 20,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipText: {
    color: Colors.text.muted,
  },
  title: {
    marginBottom: 2,
  },
  bodyText: {
    color: Colors.text.secondary,
  },
  primaryButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.interactive.primary,
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
});

export default GameplayTutorialModal;
