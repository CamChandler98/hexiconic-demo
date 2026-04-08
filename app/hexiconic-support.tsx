import { AppText } from "@/app/components/General/ui/AppText";
import {
  APP_NAME,
  PRIVACY_POLICY_PATH,
  SUPPORT_EMAIL,
} from "@/constants/appInfo";
import { Colors } from "@/theme/colors";
import { Link, Stack } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";

const SUPPORT_SUBJECT = encodeURIComponent(`${APP_NAME} support`);

export default function HexiconicSupportPage() {
  const handleEmailPress = () => {
    void Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${SUPPORT_SUBJECT}`,
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: `${APP_NAME} Support` }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.heroCard}>
          <View style={styles.kicker}>
            <AppText style={styles.kickerText}>Support</AppText>
          </View>
          <AppText variant="screenTitle" style={styles.title}>
            {APP_NAME}
          </AppText>
          <AppText style={styles.subtitle}>
            Contact us for bugs, feedback, or help with the app.
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Contact Email
          </AppText>
          <AppText selectable style={styles.email}>
            {SUPPORT_EMAIL}
          </AppText>
          <AppText style={styles.bodyCopy}>
            Send a note any time you run into a bug, want to share feedback, or
            need help with gameplay or saved progress.
          </AppText>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Email ${APP_NAME} support`}
            onPress={handleEmailPress}
            style={({ pressed }) => [
              styles.primaryAction,
              pressed && styles.primaryActionPressed,
            ]}
          >
            <AppText style={styles.primaryActionText}>Email Support</AppText>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Quick FAQ
          </AppText>
          <View style={styles.faqItem}>
            <AppText style={styles.question}>How should I report a bug?</AppText>
            <AppText style={styles.answer}>
              Include your device, platform, what you expected to happen, and
              what happened instead.
            </AppText>
          </View>
          <View style={styles.faqItem}>
            <AppText style={styles.question}>What kinds of messages help most?</AppText>
            <AppText style={styles.answer}>
              Bug reports, feature ideas, balance feedback, and help requests are
              all welcome.
            </AppText>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="sectionTitle" style={styles.sectionTitle}>
            Privacy
          </AppText>
          <AppText style={styles.bodyCopy}>
            Want the short version of how the app handles saved progress and
            rewarded ads?
          </AppText>
          <Link href={PRIVACY_POLICY_PATH} asChild>
            <Pressable
              accessibilityRole="link"
              style={({ pressed }) => [
                styles.secondaryAction,
                pressed && styles.secondaryActionPressed,
              ]}
            >
              <AppText style={styles.secondaryActionText}>
                Read Privacy Policy
              </AppText>
            </Pressable>
          </Link>
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
    backgroundColor: Colors.gem.yellow,
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
  email: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    lineHeight: 28,
    color: Colors.interactive.primary,
  },
  bodyCopy: {
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  primaryAction: {
    marginTop: 6,
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
  faqItem: {
    gap: 6,
  },
  question: {
    fontFamily: "Inter-SemiBold",
    color: Colors.text.primary,
  },
  answer: {
    color: Colors.text.secondary,
    lineHeight: 23,
  },
  secondaryAction: {
    marginTop: 4,
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
