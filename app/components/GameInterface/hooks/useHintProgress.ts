import {
  loadProgress,
  PuzzleProgressEntry,
  updatePuzzleProgress,
} from "@/app/Utility/savedata";
import { Puzzle } from "@/types/puzzle";
import { useEffect, useState } from "react";

export function useHintProgress(puzzle: Puzzle) {
  const [activeHintWord, setActiveHintWord] = useState<string | null>(null);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [freeHintRerollUsed, setFreeHintRerollUsed] = useState(false);
  const [hintRerollCount, setHintRerollCount] = useState(0);

  useEffect(() => {
    async function load() {
      const map = await loadProgress();
      const saved = map[puzzle.id];

      if (saved) {
        setActiveHintWord(saved.activeHintWord ?? null);
        setRevealedLetters(saved.revealedLetters ?? []);
        setFreeHintRerollUsed(saved.freeHintRerollUsed ?? false);
        setHintRerollCount(saved.hintRerollCount ?? 0);
      }
    }
    load();
  }, [puzzle.id]);

  function persist(partial: Partial<PuzzleProgressEntry>) {
    updatePuzzleProgress(puzzle.id, (entry) => ({
      ...entry,
      ...partial,
    }));
  }

  function startHint(word: string) {
    setActiveHintWord(word);
    setRevealedLetters([]);
    persist({ activeHintWord: word, revealedLetters: [] });
  }

  function revealLetter(key: string) {
    setRevealedLetters((prev) => {
      const next = [...prev, key];
      persist({ revealedLetters: next });
      return next;
    });
  }

  function clearHint() {
    setActiveHintWord(null);
    setRevealedLetters([]);
    persist({ activeHintWord: null, revealedLetters: [] });
  }

  /**
   * Reroll behavior:
   * - resets revealed letters (most consistent UX)
   * - marks free reroll as used (if it wasn't)
   * - increments reroll count
   */
  function rerollHint(nextWord: string) {
    const nextCount = hintRerollCount + 1;
    const nextFreeUsed = true; // reroll always consumes the free one if not already used

    setActiveHintWord(nextWord);
    setRevealedLetters([]);
    setHintRerollCount(nextCount);

    if (!freeHintRerollUsed) setFreeHintRerollUsed(true);

    persist({
      activeHintWord: nextWord,
      revealedLetters: [],
      hintRerollCount: nextCount,
      freeHintRerollUsed: nextFreeUsed,
    });
  }

  const canFreeReroll = !!activeHintWord && !freeHintRerollUsed;

  return {
    activeHintWord,
    revealedLetters,
    freeHintRerollUsed,
    hintRerollCount,
    canFreeReroll,
    startHint,
    revealLetter,
    clearHint,
    rerollHint,
  };
}

export default useHintProgress;
