import { goCompletion } from "@/app/Utility/completion";
import { Button, View } from "react-native";

type GoCompletionButtonProps = {
  puzzleId: number;
};

export const GoCompletionButton = ({ puzzleId }: GoCompletionButtonProps) => {
  return (
    <View style={{ marginTop: 12 }}>
      <Button
        title="Go to Completion (DEV)"
        onPress={() => goCompletion(puzzleId)}
      />
    </View>
  );
};
