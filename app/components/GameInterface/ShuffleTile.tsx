import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { ShuffleIcon } from "../General/ButtonIcons/ShuffleIcon";
import { GemButton } from "../General/GemButton";
type ShuffleTileProps = {
  onPress: () => void;
};



export const ShuffleTile = ({ onPress }: { onPress: () => void }) => {

  const shuffleSound = useSoundEffect(SoundEffects.ui.shuffle)

  const handlePress = () => {
    shuffleSound.play()
    onPress()
  }
  return (
    <GemButton color="#ffe4c7" onPress={handlePress}>
      <ShuffleIcon color="#6a4f2e" size={26} />
    </GemButton>
  );
};