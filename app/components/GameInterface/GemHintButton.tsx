import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { GemIconFacet } from "../General/ButtonIcons/BulbHintIcon";
import { CornerBadge } from "../General/CornerBadge";
import { GemButton } from "../General/GemButton";
import { AppText } from "../General/ui/AppText";
type GemHintButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  cost?: number;
};

export function GemHintButton({
  onPress,
  disabled = false,
  cost = 3,
}: GemHintButtonProps) {
  const hintSound = useSoundEffect(SoundEffects.rewards.hintReveal);

  const handlePress = () => {
    if (disabled) return;
    hintSound.play();
    onPress();
  };

  return (
    <GemButton onPress={handlePress} disabled={disabled} color="#e6d5ff">
      {/* Main icon */}
      <GemIconFacet />

      {/* Cost badge */}
      <CornerBadge visible={true} offsetX={-15}>
        <AppText
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#444",
          }}
        >
          {`${cost}💎`}
        </AppText>
      </CornerBadge>
    </GemButton>
  );
}
