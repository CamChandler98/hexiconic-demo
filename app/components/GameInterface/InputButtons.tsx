import React from "react";
import { View } from "react-native";
import { DeleteTile } from "./DeleteTile";
import { ShuffleTile } from "./ShuffleTile";
import { SubmitButton } from "./SubmitButton";

type InputButtonsProps = {
  onDelete: () => void;
  onSubmit: () => void;
  onShuffle: () => void;
};

export const InputButtons = ({
  onDelete,
  onSubmit,
  onShuffle,
}: InputButtonsProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        gap: 5,
        marginVertical: 20,
      }}
    >
      <DeleteTile onPress={onDelete} />
      <SubmitButton onPress={onSubmit} />
      <ShuffleTile onPress={onShuffle} />
    </View>
  );
};

export default InputButtons;
