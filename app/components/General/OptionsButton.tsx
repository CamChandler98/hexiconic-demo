import { TouchableOpacity } from "react-native";
import { SvgIconWrapper } from "./SvgIconWrapper";
import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import GearIcon from "../../../assets/graphics/Gear.svg";

type OptionsButtonProps = {
  onPress: () => void;
};

export function OptionsButtonRaw({ onPress }: OptionsButtonProps) {
  const openSound = useSoundEffect(SoundEffects.ui.openFoundWords);

  const handlePress = () => {
    openSound.play();
    onPress();
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <SvgIconWrapper size={30}>
        <GearIcon
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      </SvgIconWrapper>
    </TouchableOpacity>
  );
}

export default OptionsButtonRaw;
