import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { RerollIcon } from "../General/ButtonIcons/RerollIcon";
import { CornerBadge } from "../General/CornerBadge";
import { GemButton } from "../General/GemButton";
import { AppText } from "../General/ui/AppText";

type GemRerollButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
};

export function GemRerollButton({
  onPress,
  disabled = false,
  label = "Free",
}: GemRerollButtonProps) {
  const pressSound = useSoundEffect(SoundEffects.rewards.hintReveal);

  const handlePress = () => {
    if (disabled) return;
    pressSound.play();
    onPress();
  };

  return (
    <GemButton onPress={handlePress} disabled={disabled} color="#c7f7ff">
      <RerollIcon />

      <CornerBadge visible={true} offsetX={-10}>
        <AppText
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#444",
          }}
        >
          {label}
        </AppText>
      </CornerBadge>
    </GemButton>
  );
}
