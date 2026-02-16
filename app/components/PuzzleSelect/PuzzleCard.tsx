import {
  GemTierColors,
  GemTierLabels,
  TierKey,
} from "@/constants/Constants";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { BaseWordGrid } from "../GameInterface/BaseWordGrid";
import { ProgressBar } from "../General/ProgressBar";
import { AppText } from "../General/ui/AppText";

const screenWidth = Dimensions.get("window").width;
const cardWidth = Math.min(screenWidth * 0.8, 320);

interface PuzzleCardProps {
  id: number;
  displayId: string;
  unlocked: boolean;
  bestTier: number;
  score?: number;
  totalPoints?: number;
  onPress: () => void;
  centerLetter: string;
  letters: string[];
  baseword: string;
}

export const PuzzleCard = ({
  displayId,
  unlocked,
  bestTier,
  score = 0,
  totalPoints = 0,
  onPress,
  centerLetter,
  letters,
  baseword,
}: PuzzleCardProps) => {
  const tierKey = `Tier${bestTier}` as TierKey;
  const tierLabel = GemTierLabels[tierKey];
  const baseColor = GemTierColors[tierKey];

  return (
    <TouchableOpacity
      disabled={!unlocked}
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width: cardWidth,
        marginHorizontal: 10,
        marginVertical: 12,
      }}
    >
      <LinearGradient
        colors={unlocked ? [baseColor + "33", "#ffffff"] : ["#f0f0f0", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 22,
          paddingVertical: 16,
          paddingHorizontal: 14,
          alignItems: "center",
          // Border-only depth keeps the card look consistent across platforms.
          borderWidth: 1,
          borderColor: "#00000010",
          overflow: "hidden",
        }}
      >
        {/* Subtle top highlight */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 45,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#ffffff66",
            opacity: 0.7,
          }}
        />

        {/* Puzzle index */}
        <AppText variant="cardTitle">Puzzle {displayId}</AppText>

        {/* Grid */}
        <View style={{ transform: [{ scale: 0.7 }], marginVertical: 8 }}>
          {unlocked ? (
            <BaseWordGrid
              tier={tierKey}
              centerLetter={centerLetter}
              letters={letters}
              onPress={() => {}}
              nonInteractive
            />
          ) : (
            <Text style={{ fontSize: 42, fontWeight: "800", color: "#bbb" }}>
              🔒
            </Text>
          )}
        </View>

        {/* Tier */}
        <AppText
          variant="statLarge"
          style={{
            fontSize: 20,
            color: unlocked ? "#333" : "#999",
          }}
        >
          {unlocked ? tierLabel + "!" : "Locked"}
        </AppText>

        {/* Score */}
        <View style={{ width: "100%", marginTop: 10 }}>
          <AppText
            variant="statMedium"
            style={{
              marginBottom: 10,
              textAlign: "center",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {unlocked ? score : "—"}
          </AppText>

          {unlocked && (
            <ProgressBar
              current={score}
              total={totalPoints}
              height={8}
              color={baseColor}
              backgroundColor="#ddd"
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
