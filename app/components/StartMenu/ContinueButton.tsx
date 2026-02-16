import { GemButton } from "../General/GemButton";
import { AppText } from "../General/ui/AppText";
import { View } from "react-native";

type ContinueButtonProps = {
  loading: boolean;
  onPress: () => void;
  levelNumber: number;
  disabled?: boolean;
};

export const ContinueButton = ({
  loading,
  onPress,
  levelNumber,
  disabled = false,
}: ContinueButtonProps) => {
  const isDisabled = loading || disabled;

  return (
    <View
      pointerEvents={isDisabled ? "none" : "auto"}
      style={isDisabled ? { opacity: 0.65 } : undefined}
    >
      <GemButton color="#ffd6e0" onPress={onPress} width={120} height={48}>
        <AppText variant="buttonText">
          {loading ? "Loading..." : `Level ${levelNumber}`}
        </AppText>
      </GemButton>
    </View>
  );
};

export default ContinueButton;
