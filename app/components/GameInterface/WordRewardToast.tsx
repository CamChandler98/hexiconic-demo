import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { Colors } from "@/theme/colors";
import type { WordReward } from "@/types/reward";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { AppText } from "../General/ui/AppText";

export type WordRewardToastStreak = {
  status: "initiated" | "maintained";
  streakNumber: number;
  bonusGems: number;
  accentColor?: string;
};

type Props = {
  reward: WordReward;
  streak?: WordRewardToastStreak | null;
  onComplete: () => void;
};

export function WordRewardToast({ reward, streak, onComplete }: Props) {
  const soundKey = reward.isPangram
    ? SoundEffects.rewards.correct.pangram
    : reward.length > 4
      ? SoundEffects.rewards.correct.extra
      : SoundEffects.rewards.correct.normal;

  const { ready: rewardSoundReady, play: playRewardSound } =
    useSoundEffect(soundKey);
  const onCompleteRef = useRef(onComplete);
  const activeAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!rewardSoundReady) return;
    playRewardSound();
  }, [rewardSoundReady, playRewardSound, reward]);

  useEffect(() => {
    activeAnimation.current?.stop();
    opacity.setValue(0);
    translateY.setValue(14);
    scale.setValue(0.97);

    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(850),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    activeAnimation.current = sequence;
    sequence.start(({ finished }) => {
      if (finished) {
        onCompleteRef.current();
      }
    });

    return () => {
      sequence.stop();
    };
  }, [reward, streak, opacity, scale, translateY]);

  const accentColor = reward.isPangram
    ? Colors.feedback.warning
    : (streak?.accentColor ?? Colors.feedback.success);
  const rewardLabel = reward.isPangram
    ? "HEXICONIC"
    : reward.length >= 7
      ? "EXCELLENT"
      : "GOOD";
  const streakChainCount = streak ? Math.max(1, streak.streakNumber) : 0;
  const streakSummary = streak
    ? `${streak.status === "initiated" ? "STREAK STARTED" : `STREAK x${streakChainCount}`}${streak.bonusGems > 0 ? ` • +${streak.bonusGems} GEM` : ""}`
    : null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View
        style={[
          styles.card,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <View style={[styles.accentLine, { backgroundColor: accentColor }]} />

        <View style={styles.badge}>
          <AppText variant="label" style={styles.badgeText}>
            {rewardLabel}
          </AppText>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <AppText variant="label" style={styles.metricLabel}>
              Points
            </AppText>
            <AppText variant="sectionTitle" style={styles.metricValue}>
              +{reward.points}
            </AppText>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricBlock}>
            <AppText variant="label" style={styles.metricLabel}>
              Gems
            </AppText>
            <AppText variant="sectionTitle" style={styles.metricValue}>
              +{reward.gems}
            </AppText>
          </View>
        </View>

        {streakSummary && (
          <View style={styles.streakSummaryContainer}>
            <AppText variant="label" style={styles.streakSummaryText}>
              {streakSummary}
            </AppText>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
    elevation: 12,
  },
  card: {
    minWidth: 210,
    maxWidth: "82%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.default,
    backgroundColor: Colors.background.surface,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    overflow: "hidden",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  badge: {
    alignSelf: "center",
    marginBottom: 8,
    backgroundColor: Colors.background.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  metricBlock: {
    alignItems: "center",
    minWidth: 82,
  },
  metricLabel: {
    color: Colors.text.muted,
    includeFontPadding: false,
  },
  metricValue: {
    color: Colors.interactive.primary,
    marginTop: -2,
    includeFontPadding: false,
  },
  metricDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: Colors.border.subtle,
  },
  streakSummaryContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    alignItems: "center",
  },
  streakSummaryText: {
    color: Colors.text.secondary,
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
});
