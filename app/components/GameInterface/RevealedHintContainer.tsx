import { View } from "react-native";
import { AppText } from "../General/ui/AppText";

type RevealedHintContainerProps = {
  hintWord: string | null;
  revealedLetters: string[];
};

export const RevealedHintContainer = ({
  hintWord,
  revealedLetters,
}: RevealedHintContainerProps) => {
  const letters = hintWord ? hintWord.split("") : [];
  const isEmpty = !hintWord;

  return (
    <View
      style={{
        width: "75%",
        minHeight: 28,
        marginBottom: 6,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* CENTER: Letters (always centered) */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {isEmpty ? (
          <View style={{ flexDirection: "row" }}>
            {[...Array(3)].map((_, i) => (
              <AppText
                key={i}
                variant="inputLetterSmall"
                style={{ marginHorizontal: 2, opacity: 0.01 }}
              >
                _
              </AppText>
            ))}
          </View>
        ) : (
          letters.map((letter, i) => {
            const key = letter + i;
            const revealed = revealedLetters.includes(key);

            return (
              <AppText
                key={key}
                variant="inputLetterSmall"
                style={{
                  marginHorizontal: 2,
                  opacity: revealed ? 1 : 0.25,
                }}
              >
                {revealed ? letter.toUpperCase() : "_"}
              </AppText>
            );
          })
        )}
      </View>
    </View>
  );
};
