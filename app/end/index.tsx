import { Colors } from "@/theme/colors";
import { Layout } from "@/theme/layout";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenFooter } from "../components/General/ScreenFooter";
import { AppText } from "../components/General/ui/AppText";
import { useCurrency } from "../context/CurrencyContext";
import { deleteSaveData } from "../Utility/savedata";

export default function EndOfContentScreen() {
  const { setGems } = useCurrency();
  const router = useRouter();

  const [showResetModal, setShowResetModal] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const canConfirmReset = useMemo(
    () => deleteText.trim().toLowerCase() === "delete",
    [deleteText],
  );

  const handleOpenResetModal = () => {
    setDeleteText("");
    setResetError(null);
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    if (isResetting) return;
    setDeleteText("");
    setResetError(null);
    setShowResetModal(false);
  };

  const handleConfirmReset = async () => {
    if (!canConfirmReset || isResetting) return;
    setIsResetting(true);
    setResetError(null);

    try {
      await deleteSaveData();
      setGems(0);
      setShowResetModal(false);
      setDeleteText("");
      router.replace("/start");
    } catch (error) {
      console.error("Failed to delete save data", error);
      setResetError("Unable to reset app data. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <View style={[Layout.screen, styles.container]}>
        <View style={styles.mainContent}>
          <AppText variant="sectionTitle" style={{ marginBottom: 12 }}>
            You’re all caught up!
          </AppText>

          <AppText variant="body" style={styles.subtitle}>
            You’ve completed the Hexiconic demo!
          </AppText>

          <AppText variant="body" style={styles.subtitle}>
            Check out my GitHub and portfolio for more projects, and stay tuned
            for updates to this game!
          </AppText>

          <AppText
            variant="body"
            style={[styles.subtitle, { marginBottom: 5 }]}
          >
            Made with ❤️
          </AppText>
          <AppText variant="body" style={[styles.subtitle]}>
            - Cam
          </AppText>
          <View style={styles.resetSection}>
            <AppText variant="bodySmall" style={styles.resetSubtitle}>
              Want to replay from scratch?
            </AppText>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleOpenResetModal}
              disabled={isResetting}
            >
              <AppText variant="buttonLabel" style={styles.resetButtonText}>
                Reset App Data
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <ScreenFooter />
      </View>

      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseResetModal}
      >
        <View style={styles.centeredOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdropClickable}
            onPress={handleCloseResetModal}
          />

          <View style={[styles.resetModalContainer, Layout.cardMuted]}>
            <AppText variant="sectionTitle" style={styles.resetModalTitle}>
              Reset App Data
            </AppText>

            <AppText variant="bodySmall" style={styles.resetModalSubtitle}>
              Type delete to confirm. This action cannot be undone.
            </AppText>

            <TextInput
              value={deleteText}
              onChangeText={setDeleteText}
              placeholder="delete"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isResetting}
              style={styles.deleteInput}
              placeholderTextColor="#999999"
            />

            {resetError ? (
              <AppText variant="bodySmall" style={styles.resetErrorText}>
                {resetError}
              </AppText>
            ) : null}

            <View style={styles.resetActionRow}>
              <TouchableOpacity
                style={styles.cancelResetButton}
                onPress={handleCloseResetModal}
                disabled={isResetting}
              >
                <AppText variant="buttonLabel" style={styles.cancelResetText}>
                  Cancel
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmResetButton,
                  (!canConfirmReset || isResetting) &&
                    styles.confirmResetButtonDisabled,
                ]}
                onPress={handleConfirmReset}
                disabled={!canConfirmReset || isResetting}
              >
                <AppText variant="buttonLabel" style={styles.confirmResetText}>
                  {isResetting ? "Resetting..." : "Confirm"}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.75,
    marginBottom: 40,
  },
  resetSection: {
    marginTop: 8,
    alignItems: "center",
  },
  resetSubtitle: {
    marginBottom: 10,
    color: "#666666",
  },
  resetButton: {
    backgroundColor: Colors.feedback.danger,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 150,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
  },
  centeredOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backdropClickable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  resetModalContainer: {
    width: "85%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  resetModalTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  resetModalSubtitle: {
    textAlign: "center",
    color: "#666666",
    marginBottom: 12,
  },
  deleteInput: {
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    color: "#222222",
  },
  resetErrorText: {
    color: Colors.feedback.danger,
    marginTop: 8,
  },
  resetActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  cancelResetButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: Colors.interactive.disabled,
  },
  cancelResetText: {
    color: "#333333",
  },
  confirmResetButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: Colors.feedback.danger,
  },
  confirmResetButtonDisabled: {
    opacity: 0.45,
  },
  confirmResetText: {
    color: "#FFFFFF",
  },
});
