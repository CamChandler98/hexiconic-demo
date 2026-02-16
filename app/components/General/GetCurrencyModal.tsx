import { useCurrency } from "@/app/context/CurrencyContext";
import { useDailyRewardState } from "@/app/hooks/useDailyRewardState";
import { useRewardedAd } from "@/app/hooks/useRewardedAd";
import { GEMS_DAILY_REWARD, GEMS_PER_REWARDED_AD } from "@/constants/Constants";
import { Layout } from "@/theme/layout";
import { useCallback } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "./ui/AppText";

type GetCurrencyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const GetCurrencyModal = ({
  visible,
  onClose,
}: GetCurrencyModalProps) => {
  const { addGems } = useCurrency();

  const { isAvailable, isLoading, claimReward } = useDailyRewardState();

  const handleAdReward = useCallback(() => {
    addGems(GEMS_PER_REWARDED_AD);
  }, [addGems]);

  const handleAdClosed = useCallback(() => {
    setTimeout(() => {
      onClose();
    }, 500);
  }, [onClose]);

  const {
    loaded: adLoaded,
    showing,
    showAd,
  } = useRewardedAd(handleAdReward, handleAdClosed);

  const handlePrimaryPress = async () => {
    if (showing) return;

    if (isAvailable) {
      await claimReward();
      addGems(GEMS_DAILY_REWARD);
      onClose();
      return;
    }

    if (!adLoaded) return;

    showAd();
  };

  const primaryDisabled = isLoading || showing || (!isAvailable && !adLoaded);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Full-screen overlay that centers the modal card. */}
      <View style={styles.centeredOverlay}>
        {/* Backdrop that closes the modal when pressed. */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropClickable}
          onPress={onClose}
        />

        {/* Centered modal card content. */}
        <View
          style={[styles.container, Layout.cardMuted]}
          pointerEvents={showing ? "none" : "auto"}
        >
          <AppText variant="sectionTitle" style={styles.title}>
            Get Gems
          </AppText>

          <AppText variant="bodySmall" style={styles.subtitle}>
            {isAvailable
              ? "A daily gift is ready 💎"
              : "Watch a short ad to earn gems you can spend on hints."}
          </AppText>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              primaryDisabled && styles.primaryButtonDisabled,
            ]}
            disabled={primaryDisabled}
            onPress={handlePrimaryPress}
          >
            <AppText variant="buttonLabel" style={styles.buttonText}>
              {isAvailable
                ? `Claim Daily Gift -> +${GEMS_DAILY_REWARD} 💎`
                : adLoaded
                  ? "Watch Ad -> Get 💎"
                  : "Ads not supported on web, sorry!"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <AppText variant="bodySmall" style={styles.cancelText}>
              Not now
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  // Full-screen touch target behind the modal card.
  backdropClickable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  container: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },

  title: {
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: "#4E6DC4",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#4E6DC4",
    opacity: 0.7,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
  },

  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },

  cancelText: {
    color: "#888",
  },
});

export default GetCurrencyModal;
