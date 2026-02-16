import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "../General/ButtonIcons/CheckIcon";
import { GemButton } from "../General/GemButton";

type SubmitButtonProps = {
  onPress: () => void;
};

const SUBMIT_COOLDOWN_MS = 400;

export const SubmitButton = ({ onPress }: SubmitButtonProps) => {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    if (isCoolingDown) return;

    setIsCoolingDown(true);
    onPress();

    cooldownTimeoutRef.current = setTimeout(() => {
      setIsCoolingDown(false);
      cooldownTimeoutRef.current = null;
    }, SUBMIT_COOLDOWN_MS);
  };

  return (
    <GemButton color="#c7ebff" onPress={handlePress} disabled={isCoolingDown}>
      <CheckIcon color="#2c4a60" size={26} />
    </GemButton>
  );
};
