import { usePuzzleContext } from "@/app/context/PuzzleContext";
import { loadGameState } from "@/app/Utility/savedata";
import rawPuzzles from "@/assets/data/reordered_chapters.json";
import { Puzzle, PuzzleBook } from "@/types/puzzle";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GemCounter } from "../General/GemCounter";
import { ProgressBar } from "../General/ProgressBar";
import { ScreenFooter } from "../General/ScreenFooter";
import { ScreenHeader } from "../General/ScreenHeader";
import ContinueButton from "./ContinueButton";
import { StartTitle } from "./StartTitle";

const puzzleBook = rawPuzzles as PuzzleBook;
export const StartMenuContainer = () => {
  const router = useRouter();

  const { setCurrentPuzzle } = usePuzzleContext();

  const [loading, setLoading] = useState(true);

  const [levelNumber, setLevelNumber] = useState<number>(1);

  const [chapterCompleted, setChapterCompleted] = useState(0);
  const [chapterTotal, setChapterTotal] = useState(5);

  const handleGoGame = async () => {
    if (loading) return;
    router.push("/game");
  };

  useEffect(() => {
    async function loadChapterProgress() {
      setLoading(true);
      const state = await loadGameState();
      const chapter = puzzleBook.chapters[state.chapterIndex];

      if (!chapter) {
        throw new Error("chapter failed to load");
      }

      const puzzle = chapter["puzzles"][state.puzzleIndex];

      if (!puzzle) {
        throw new Error("puzzle failed to load");
      }

      setLevelNumber(puzzle.globalLevelNumber);
      setChapterCompleted(state.puzzleIndex + 1);
      setChapterTotal(chapter.puzzles.length);

      setLoading(true);

      try {
        const chapterIndex = state.chapterIndex ?? 0;
        const puzzleIndex = state.puzzleIndex ?? 0;

        const chapter =
          puzzleBook.chapters[chapterIndex] ?? puzzleBook.chapters;

        if (!chapter) {
          throw new Error("No chapter available");
        }

        const puzzle: Puzzle = chapter["puzzles"][puzzleIndex];

        if (!puzzle) {
          throw new Error("No puzzles in chapter");
        }

        setCurrentPuzzle(puzzle);
      } catch (e) {
        console.error("fail to continue", e);
      } finally {
        setLoading(false);
      }
    }

    loadChapterProgress();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER (full width) */}
      <ScreenHeader backEnabled={false} rightSlot={<GemCounter />} />

      {/* CENTERED CONTENT */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <StartTitle />
        <View style={{ width: "60%", marginBottom: 8 }}>
          <ProgressBar
            current={chapterCompleted - 1}
            total={chapterTotal}
            height={30}
            color="#ffd1df"
            backgroundColor="#E6E6E6"
            showLabel={!loading}
          />
        </View>
        {/* <StartButton /> */}
        <ContinueButton
          loading={loading}
          onPress={handleGoGame}
          levelNumber={levelNumber}
        />
      </View>

      <ScreenFooter />
    </View>
  );
};
