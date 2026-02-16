import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { DeleteIcon } from "../General/ButtonIcons/DeleteIcon";
import { GemButton } from "../General/GemButton";


type DeleteTileProps = {
    onPress : () => void;
};


export const DeleteTile = ({ onPress }: { onPress: () => void }) => {

  const deleteSound = useSoundEffect(SoundEffects.ui.delete)

  const handlePress = () => {
      deleteSound.play()
      onPress()
  }
  return (
    <GemButton color="#ffd6e0" onPress={handlePress}>
      <DeleteIcon color="#62313a" size={26} />
    </GemButton>
  );
};