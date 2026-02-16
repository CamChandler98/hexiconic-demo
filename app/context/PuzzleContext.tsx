import { Puzzle } from "@/types/puzzle";
import React, { createContext, ReactNode, useContext, useState } from "react";
// 1. Define the shape of the context
interface PuzzleContextType {
  currentPuzzle: Puzzle | null;
  setCurrentPuzzle: (puzzle: Puzzle) => void;
}

// 2. Create the context with a default undefined value
const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined);

// 3. Create the Provider Component
export const PuzzleProvider = ({ children }: { children: ReactNode }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);

  return (
    <PuzzleContext.Provider value={{ currentPuzzle, setCurrentPuzzle }}>
      {children}
    </PuzzleContext.Provider>
  );
};

// 4. Create a custom hook for easy access
export const usePuzzleContext = () => {
  const context = useContext(PuzzleContext);
  if (!context) {
    throw new Error("usePuzzleContext must be used within a PuzzleProvider");
  }
  return context;
};