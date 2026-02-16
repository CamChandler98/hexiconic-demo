import { useStaggeredRiseIn } from "@/app/hooks/animation/useStaggeredRiseIn";
import { Layout } from "@/theme/layout";
import { Animated, View } from "react-native";
import { ProgressBar } from "../General/ProgressBar";
import { AppText } from "../General/ui/AppText";
import ContinueButton from "../StartMenu/ContinueButton";

type ContinueScreenContainerProps = {
  onContinue: () => void;
  loading: boolean;
  chapterCompleted: number;
  chapterTotal: number;
  level: number;
  chapterNumber?: number;
};

const TITLE = "Puzzle Complete";

export const ContinueScreenContainer = ({
  onContinue,
  loading,
  chapterCompleted,
  chapterTotal,
  level,
  chapterNumber,
}: ContinueScreenContainerProps) => {
  const letters = TITLE.split("");
  const letterAnimations = useStaggeredRiseIn(letters.length);

  return (
    <View style={{ flex: 1, backgroundColor: Layout.screen.backgroundColor }}>
      {/* Optional: if you want header on continue, render it here */}
      {/* <ScreenHeader ... /> */}

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: "100%",
            maxWidth: 520,
            paddingHorizontal: 24,
            alignItems: "center",
            transform: [{ translateY: -16 }], // slight bias looks better on tablets
          }}
        >
          {/* Animated title */}
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            {letters.map((char, i) => (
              <Animated.Text
                key={`${char}-${i}`}
                style={[
                  { fontSize: 30, fontWeight: "600", color: "#3f3f3f" },
                  letterAnimations[i],
                ]}
              >
                {char === " " ? "\u00A0" : char}
              </Animated.Text>
            ))}
          </View>

          <AppText
            variant="sectionTitle"
            style={{ marginBottom: 8, color: "#575656", opacity: 0.9 }}
          >
            Chapter {chapterNumber}
          </AppText>
          <AppText
            variant="bodySmall"
            style={{ marginBottom: 24, opacity: 0.7 }}
          >
            Chapter progress
          </AppText>

          {/* Chapter progress bar */}
          <View style={{ width: "100%", marginBottom: 8 }}>
            <ProgressBar
              current={chapterCompleted}
              total={chapterTotal}
              height={20}
              color="#ffd1df"
              backgroundColor="#E6E6E6"
            />
          </View>

          <AppText
            variant="bodySmall"
            style={{ marginBottom: 32, opacity: 0.6 }}
          >
            {chapterCompleted} / {chapterTotal} puzzles completed
          </AppText>

          <ContinueButton
            onPress={onContinue}
            loading={loading}
            levelNumber={level + 1}
          />
        </View>
      </View>
    </View>
  );
};

export default ContinueScreenContainer;
