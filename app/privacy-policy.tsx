import { AppText } from "@/app/components/General/ui/AppText";
import {
  APP_NAME,
  PRIVACY_LAST_UPDATED,
  SUPPORT_EMAIL,
  SUPPORT_PATH,
} from "@/constants/appInfo";
import { Colors } from "@/theme/colors";
import { Link, Stack } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";

const PRIVACY_SUBJECT = encodeURIComponent(`${APP_NAME} privacy question`);

export default function PrivacyPolicyPage() {
  const handleEmailPress = () => {
    void Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${PRIVACY_SUBJECT}`,
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: `${APP_NAME} Privacy Policy` }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.heroCard}>
          <View style={styles.kicker}>
            <AppText style={styles.kickerText}>Privacy Policy</AppText>
          </View>
          <AppText variant="screenTitle" style={styles.title}>
            {APP_NAME}
          </AppText>
          <AppText style={styles.subtitle}>
            Last updated {PRIVACY_LAST_UPDATED}
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            What The App Stores
          </AppText>
          <AppText style={styles.bodyCopy}>
            {APP_NAME} stores gameplay data such as saved progress, gem totals,
            and sound settings locally on your device so the game can remember
            your session.
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Accounts And Personal Info
          </AppText>
          <AppText style={styles.bodyCopy}>
            The app does not require you to create an account or provide a name,
            username, or password in order to play.
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Rewarded Ads
          </AppText>
          <AppText style={styles.bodyCopy}>
            Supported mobile builds may show rewarded ads. When an ad is shown,
            the ad provider may collect device or usage information needed to
            serve and measure ads under its own policies.
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Contact
          </AppText>
          <AppText selectable style={styles.email}>
            {SUPPORT_EMAIL}
          </AppText>
          <View style={styles.actionsRow}>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Email ${APP_NAME} privacy contact`}
              onPress={handleEmailPress}
              style={({ pressed }) => [
                styles.primaryAction,
                pressed && styles.primaryActionPressed,
              ]}
            >
              <AppText style={styles.primaryActionText}>Email Us</AppText>
            </Pressable>
            <Link href={SUPPORT_PATH} asChild>
              <Pressable
                accessibilityRole="link"
                style={({ pressed }) => [
                  styles.secondaryAction,
                  pressed && styles.secondaryActionPressed,
                ]}
              >
                <AppText style={styles.secondaryActionText}>
                  Back To Support
                </AppText>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    backgroundColor: Colors.background.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  kicker: {
    alignSelf: "flex-start",
    backgroundColor: Colors.gem.blue,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  kickerText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: Colors.text.primary,
    letterSpacing: 0.3,
  },
  title: {
    marginBottom: 12,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
    color: Colors.text.secondary,
  },
  sectionCard: {
    backgroundColor: Colors.background.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 2,
    color: Colors.text.primary,
  },
  bodyCopy: {
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  email: {
    fontFamily: "Inter-SemiBold",
    fontSize: 19,
    lineHeight: 27,
    color: Colors.interactive.primary,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  primaryAction: {
    alignSelf: "flex-start",
    backgroundColor: Colors.interactive.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryActionPressed: {
    opacity: 0.88,
  },
  primaryActionText: {
    fontFamily: "Inter-SemiBold",
    color: Colors.background.surface,
    fontSize: 16,
  },
  secondaryAction: {
    alignSelf: "flex-start",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.surfaceMuted,
  },
  secondaryActionPressed: {
    opacity: 0.88,
  },
  secondaryActionText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors.text.primary,
  },
});
