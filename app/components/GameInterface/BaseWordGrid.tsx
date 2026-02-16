import { useStaggeredRiseIn } from "@/app/hooks/animation/useStaggeredRiseIn";
import { View } from "react-native";
import { LetterTile } from "./LetterTile";

type BaseWordGridProps = {
  letters: string[];
  onPress: (letter: string) => void;
  tier: string;
  centerLetter: string;
  nonInteractive?: boolean;
  animateOnMount?: boolean;
};

export const BaseWordGrid = ({
  letters,
  tier,
  centerLetter,
  onPress,
  nonInteractive = false,
  animateOnMount = false,
}: BaseWordGridProps) => {
  // Honeycomb mapped by *column*, not row
  const honeycomb = [
    [0, 3], // left column
    [1, 4, 5], // center column
    [2, 6],        // right column
  ];
  const tileRiseInStyles = useStaggeredRiseIn(letters.length, {
    enabled: animateOnMount,
  });

  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      {honeycomb.map((column, colIndex) => (
        <View
          key={colIndex}
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 0,
          }}
        >
          {column.map((letterIndex) => {
            const isCenter = letters[letterIndex] === centerLetter;
            
            return (
              <LetterTile
                key={letterIndex}
                letter={letters[letterIndex]}
                isCenter={isCenter}
                tier={tier}
                onPress={
                  nonInteractive ? () => {} : () => onPress(letters[letterIndex])
                }
                nonInteractive={nonInteractive}
                riseInStyle={
                  animateOnMount ? tileRiseInStyles[letterIndex] : undefined
                }
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};
