import { useCurrency } from "@/app/context/CurrencyContext";
import { useSoundSettings } from "@/app/context/SoundSettingsContext";
import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { deleteSaveData } from "@/app/Utility/savedata";
import { darkenColor } from "@/app/Utility/ui";
import { Colors } from "@/theme/colors";
import { Layout } from "@/theme/layout";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText } from "./ui/AppText";

type OptionsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function OptionsModal({ visible, onClose }: OptionsModalProps) {
  const { muted, setMuted } = useSoundSettings();
  const { setGems } = useCurrency();
  const router = useRouter();

  const closeSound = useSoundEffect(SoundEffects.ui.close);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canConfirmDelete = useMemo(
    () => deleteText.trim().toLowerCase() === "delete",
    [deleteText],
  );

  useEffect(() => {
    if (visible) return;
    setShowDeleteModal(false);
    setDeleteText("");
    setDeleteError(null);
    setIsDeleting(false);
  }, [visible]);

  const handleClose = () => {
    if (isDeleting) return;
    closeSound.play();
    setShowDeleteModal(false);
    setDeleteText("");
    setDeleteError(null);
    onClose();
  };

  const handleOpenDeleteModal = () => {
    setDeleteError(null);
    setDeleteText("");
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setDeleteError(null);
    setDeleteText("");
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!canConfirmDelete || isDeleting) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteSaveData();
      setGems(0);
      setShowDeleteModal(false);
      setDeleteText("");
      onClose();
      router.replace("/start");
    } catch (error) {
      console.error("Failed to delete save data", error);
      setDeleteError("Unable to delete save data. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.centeredOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdropClickable}
            onPress={handleClose}
          />

          <View style={[styles.container, Layout.cardMuted]}>
            <AppText variant="sectionTitle" style={styles.title}>
              Options
            </AppText>

            <View style={styles.section}>
              <AppText variant="bodySmall" style={styles.sectionLabel}>
                Audio
              </AppText>

              <View style={styles.row}>
                <View style={styles.rowText}>
                  <AppText variant="body" style={styles.rowTitle}>
                    Sound Effects
                  </AppText>
                  <AppText variant="bodySmall" style={styles.rowSubtitle}>
                    {muted ? "Muted" : "On"}
                  </AppText>
                </View>

                <Switch
                  value={!muted}
                  onValueChange={(on) => setMuted(!on)}
                  trackColor={{
                    true: darkenColor(Colors.gem.pink),
                    false: Colors.interactive.disabled,
                  }}
                  activeThumbColor={Colors.gem.pink}
                  thumbColor={Colors.gem.pink}
                  ios_backgroundColor={Colors.gem.pink}
                />
              </View>
            </View>

            <View style={styles.section}>
              <AppText variant="bodySmall" style={styles.sectionLabel}>
                Save Data
              </AppText>

              <View style={styles.row}>
                <View style={styles.rowText}>
                  <AppText variant="body" style={styles.rowTitle}>
                    Delete Saved Data
                  </AppText>
                  <AppText variant="bodySmall" style={styles.rowSubtitle}>
                    Clears progress, gems, and daily reward.
                  </AppText>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  disabled={isDeleting}
                  onPress={handleOpenDeleteModal}
                >
                  <AppText
                    variant="buttonLabel"
                    style={styles.deleteButtonText}
                  >
                    Delete
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <AppText variant="buttonLabel" style={styles.closeText}>
                Done
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDeleteModal}
      >
        <View style={styles.centeredOverlay}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdropClickable}
            onPress={handleCloseDeleteModal}
          />

          <View style={[styles.deleteModalContainer, Layout.cardMuted]}>
            <AppText variant="sectionTitle" style={styles.deleteModalTitle}>
              Delete Save Data
            </AppText>

            <AppText variant="bodySmall" style={styles.deleteModalSubtitle}>
              Type delete to confirm. This action cannot be undone.
            </AppText>

            <TextInput
              value={deleteText}
              onChangeText={setDeleteText}
              placeholder="delete"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isDeleting}
              style={styles.deleteInput}
              placeholderTextColor="#999999"
            />

            {deleteError ? (
              <AppText variant="bodySmall" style={styles.deleteErrorText}>
                {deleteError}
              </AppText>
            ) : null}

            <View style={styles.deleteActionRow}>
              <TouchableOpacity
                style={styles.cancelDeleteButton}
                onPress={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                <AppText variant="buttonLabel" style={styles.cancelDeleteText}>
                  Cancel
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmDeleteButton,
                  (!canConfirmDelete || isDeleting) &&
                    styles.confirmDeleteButtonDisabled,
                ]}
                onPress={handleConfirmDelete}
                disabled={!canConfirmDelete || isDeleting}
              >
                <AppText variant="buttonLabel" style={styles.confirmDeleteText}>
                  {isDeleting ? "Deleting..." : "Confirm"}
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
  container: {
    width: "85%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },

  section: {
    marginTop: 6,
  },
  sectionLabel: {
    color: "#777",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  rowText: {
    flexShrink: 1,
    paddingRight: 12,
  },
  rowTitle: {
    // keep default text color
  },
  rowSubtitle: {
    color: "#666",
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: Colors.feedback.danger,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 82,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
  },

  closeButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.gem.pink,
  },
  closeText: {
    color: "#FFFFFF",
  },

  deleteModalContainer: {
    width: "85%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  deleteModalTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  deleteModalSubtitle: {
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
  deleteErrorText: {
    color: Colors.feedback.danger,
    marginTop: 8,
  },
  deleteActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  cancelDeleteButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: Colors.interactive.disabled,
  },
  cancelDeleteText: {
    color: "#333333",
  },
  confirmDeleteButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: Colors.feedback.danger,
  },
  confirmDeleteButtonDisabled: {
    opacity: 0.45,
  },
  confirmDeleteText: {
    color: "#FFFFFF",
  },
});
