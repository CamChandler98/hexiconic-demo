import { GEMS_PER_HINT_LETTER } from "@/constants/Constants";
import React from "react";
import { View } from "react-native";
import { GemRerollButton } from "./GemRerollButton";
import { GameGetCurrencyButton } from "./GameInterfaceGetCurrencyButton";
import { GemHintButton } from "./GemHintButton";

type CurrencyButtonsProps = {
  onClickHint: () => void;
  hintDisabled: boolean;
  onClickCurrency: () => void;
  onClickReroll?: () => void;
  showReroll?: boolean;
  rerollDisabled?: boolean;
  rerollLabel?: string;
};

export const CurrencyButtons = ({
  onClickHint,
  hintDisabled,
  onClickCurrency,
  onClickReroll,
  showReroll = false,
  rerollDisabled = false,
  rerollLabel = "Free",
}: CurrencyButtonsProps) => {
  const formattedRerollLabel =
    rerollLabel.toLowerCase() === "free"
      ? rerollLabel
      : rerollLabel.includes("💎")
        ? rerollLabel
        : `${rerollLabel.replace(/\s*gems?$/i, "")}💎`;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        gap: 10,
        marginVertical: 10,
      }}
    >
      <GameGetCurrencyButton onPress={onClickCurrency} />
      <GemHintButton
        onPress={onClickHint}
        disabled={hintDisabled}
        cost={GEMS_PER_HINT_LETTER}
      />
      {showReroll && onClickReroll && (
        <GemRerollButton
          onPress={onClickReroll}
          disabled={rerollDisabled}
          label={formattedRerollLabel}
        />
      )}
    </View>
  );
};
