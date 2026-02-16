import { Button, View } from "react-native";


type TriggerRewardButtonProps = {
  onPress: () => void;
};

export const TriggerRewardButton = ({ onPress }: TriggerRewardButtonProps) => {
  return (
    <View style={{ marginVertical: 8 }}>
      <Button title="Trigger Reward (Debug)" onPress={onPress} />
    </View>
  );
};

export default TriggerRewardButton
