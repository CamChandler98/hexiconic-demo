import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import { TouchableOpacity } from "react-native";
import GemAddIcon from "../../../assets/graphics/GemAdd.svg";
import { SvgIconWrapper } from "./SvgIconWrapper";
type GemHintButtonProps = {
  sparkleColor?: string;
  strokeColor?: string;
  gemFill?: string;
  onPress: () => void;
};

export function GetCurrencyButtonRaw({ onPress }: GemHintButtonProps) {
  const openSound = useSoundEffect(SoundEffects.rewards.hintReveal);

  const handlePress = () => {
    openSound.play();
    onPress();
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <SvgIconWrapper size={25}>
        <GemAddIcon
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      </SvgIconWrapper>
    </TouchableOpacity>
  );
}

export default GetCurrencyButtonRaw;
