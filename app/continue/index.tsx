import rawPuzzles from "@/assets/data/reordered_chapters.json";
import { Puzzle, PuzzleBook } from "@/types/puzzle";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ContinueScreenContainer from "../components/ContinueScreen/ContinueScreenContainer";
import { usePuzzleContext } from "../context/PuzzleContext";
import {
  GameProgressState,
  loadGameState,
  updateGameState,
} from "../Utility/savedata";

const puzzleBook = rawPuzzles as PuzzleBook;

export default function ContinueScreen() {
  const router = useRouter();
  const { setCurrentPuzzle } = usePuzzleContext();
  const [loading, setLoading] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState(0);
  const [chapterTotal, setChapterTotal] = useState(0);
  const [chapterNumber, setChapterNumber] = useState(1);
  const [levelNumber, setLevelNumber] = useState<number>(1);

  useEffect(() => {
    async function loadChapterProgress() {
      const state = await loadGameState();
      const chapter = puzzleBook.chapters[state.chapterIndex];
      if (!chapter) return;
      const puzzle: Puzzle = chapter["puzzles"][state.puzzleIndex];
      if (!puzzle) return;
      setLevelNumber(puzzle.globalLevelNumber);
      setChapterCompleted(state.puzzleIndex + 1);
      setChapterTotal(chapter.puzzles.length);
      setChapterNumber(chapter.chapter);

      try {
        setLoading(true);
        const state: GameProgressState = await loadGameState();
        const { chapterIndex, puzzleIndex } = state;

        const chapter = puzzleBook.chapters[chapterIndex];
        if (!chapter) return;

        let nextChapterIndex = chapterIndex;
        let nextPuzzleIndex = puzzleIndex + 1;

        if (nextPuzzleIndex >= chapter.puzzles.length) {
          nextChapterIndex += 1;
          nextPuzzleIndex = 0;
        }

        const nextChapter = puzzleBook.chapters[nextChapterIndex];
        if (!nextChapter) {
          router.replace("/end");
          return;
        }

        const nextPuzzle = nextChapter.puzzles[nextPuzzleIndex];
        if (!nextPuzzle) {
          return;
        }

        // Persist the next puzzle position.
        await updateGameState(() => ({
          chapterIndex: nextChapterIndex,
          puzzleIndex: nextPuzzleIndex,
          puzzleId: nextPuzzle.id,
          startedAt: Date.now(),
          lastPlayedAt: Date.now(),
        }));

        // Load the selected puzzle into context for the game screen.
        setCurrentPuzzle(nextPuzzle);
      } catch (e) {
        console.error("Failed to continue", e);
      } finally {
        setLoading(false);
      }
    }

    loadChapterProgress();
  }, []);

  return (
    <ContinueScreenContainer
      onContinue={() => {
        if (loading) return;
        router.replace("/game");
      }}
      loading={loading}
      chapterCompleted={chapterCompleted}
      chapterTotal={chapterTotal}
      level={levelNumber}
      chapterNumber={chapterNumber}
    />
  );
}
