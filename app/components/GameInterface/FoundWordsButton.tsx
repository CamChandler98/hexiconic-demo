import { TouchableOpacity } from "react-native";
import { BookIcon } from "../General/ButtonIcons/BookIcon";
import { AppText } from "../General/ui/AppText";

import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";

type FoundWordsButtonProps = {
  found: number;
  total: number;
  onPress: () => void;
  color?: string;
};

export function FoundWordsButton({
  found,
  total,
  onPress,
  color,
}: FoundWordsButtonProps) {
  const openSound = useSoundEffect(SoundEffects.ui.openFoundWords);

  const handlePress = () => {
    openSound.play();
    onPress();
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
      }}
    >
      <BookIcon size={28} color={color} />
      <AppText
        style={{
          fontSize: 14,
          color: "#666",
        }}
      >
        {found}
      </AppText>
    </TouchableOpacity>
  );
}
