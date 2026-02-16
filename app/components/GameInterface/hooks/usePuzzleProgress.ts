import { getCompletionScore } from "@/app/Utility/completion";
import { loadProgress, updatePuzzleProgress } from "@/app/Utility/savedata";
import { COMPLETION_THRESHOLD } from "@/constants/Constants";
import { Puzzle } from "@/types/puzzle";
import { useEffect, useRef, useState } from "react";
type UsePuzzleProgressResult = {
  foundWords: string[];
  score: number;
  completionScore: number;
  completed: boolean;
  addFoundWord: (
    word: string,
    points: number,
    gemsEarned: number,
  ) => Promise<boolean>;
};

export function usePuzzleProgress(puzzle: Puzzle): UsePuzzleProgressResult {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const foundWordsRef = useRef<string[]>([]);
  const completedRef = useRef(false);

  const completionScore = getCompletionScore(
    puzzle.totalPoints,
    COMPLETION_THRESHOLD,
    puzzle.globalLevelNumber,
    puzzle.subwordCount,
  );

  // ─────────────────────────────
  // Load saved progress
  // ─────────────────────────────
  useEffect(() => {
    async function load() {
      const map = await loadProgress();
      const saved = map[puzzle.id];

      if (saved) {
        const savedFoundWords = Array.isArray(saved.foundWords)
          ? saved.foundWords
          : [];
        const normalizedFoundWords = Array.from(new Set(savedFoundWords));
        const normalizedScore = normalizedFoundWords.reduce(
          (sum, w) => sum + (puzzle.subwords[w] ?? 0),
          0,
        );
        const normalizedCompleted =
          !!saved.completed || normalizedScore >= completionScore;

        foundWordsRef.current = normalizedFoundWords;
        setFoundWords(normalizedFoundWords);
        setScore(normalizedScore);
        completedRef.current = normalizedCompleted;

        const needsRepair =
          normalizedFoundWords.length !== savedFoundWords.length ||
          saved.score !== normalizedScore ||
          saved.completed !== normalizedCompleted;

        if (needsRepair) {
          await updatePuzzleProgress(puzzle.id, (entry) => ({
            ...entry,
            foundWords: normalizedFoundWords,
            score: normalizedScore,
            completed: normalizedCompleted,
          }));
        }
      } else {
        await updatePuzzleProgress(puzzle.id, () => ({
          foundWords: [],
          score: 0,
          completed: false,
          activeHintWord: null,
          revealedLetters: [],
        }));
      }
    }

    load();
  }, [puzzle.id]);

  // ─────────────────────────────
  // Add a found word + persist
  // ─────────────────────────────
  async function addFoundWord(
    word: string,
    _points: number,
    gemsEarned: number,
  ): Promise<boolean> {
    const currentFoundWords = foundWordsRef.current;
    if (currentFoundWords.includes(word)) {
      return completedRef.current;
    }

    const updatedFoundWords = [...currentFoundWords, word];
    const newScore = updatedFoundWords.reduce(
      (sum, w) => sum + (puzzle.subwords[w] ?? 0),
      0,
    );

    foundWordsRef.current = updatedFoundWords;
    setFoundWords(updatedFoundWords);
    setScore(newScore);

    const isNowComplete = completedRef.current || newScore >= completionScore;
    if (isNowComplete) {
      completedRef.current = true;
    }

    await updatePuzzleProgress(puzzle.id, (entry) => ({
      ...entry,
      foundWords: updatedFoundWords,
      score: newScore,
      gemsEarned: (entry.gemsEarned ?? 0) + gemsEarned,
      completed: isNowComplete,
    }));

    return isNowComplete;
  }

  return {
    foundWords,
    score,
    completionScore,
    completed: completedRef.current,
    addFoundWord,
  };
}

export default usePuzzleProgress;
