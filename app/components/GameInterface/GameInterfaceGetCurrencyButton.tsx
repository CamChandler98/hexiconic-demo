import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { useDailyRewardState } from "@/app/hooks/useDailyRewardState";
import { GemBagFacet } from "../General/ButtonIcons/BagIcon";
import { CornerBadge } from "../General/CornerBadge";
import { GemButton } from "../General/GemButton";
import { AppText } from "../General/ui/AppText";

type GameGetCurrencyButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  cost?: number;
};

export function GameGetCurrencyButton({
  onPress,
  disabled = false,
  cost = 3,
}: GameGetCurrencyButtonProps) {
  const hintSound = useSoundEffect(SoundEffects.rewards.hintReveal);

  const { isAvailable } = useDailyRewardState();

  const handlePress = () => {
    if (disabled) return;
    hintSound.play();
    onPress();
  };

  return (
    <GemButton onPress={handlePress} disabled={disabled} color="#D5FFD5">
      {/* Main icon */}
      <GemBagFacet />

      {/* Cost badge */}
      <CornerBadge visible={true} offsetX={-10}>
        <AppText
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#444",
          }}
        >
          {isAvailable ? "!💎" : "+"}
        </AppText>
      </CornerBadge>
    </GemButton>
  );
}
