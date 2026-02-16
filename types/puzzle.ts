export type Puzzle = {
  id: number;
  baseword: string;
  center: string;
  letters: string[];
  subwords: Record<string, number>;
  totalPoints: number;
  subwordCount: number;
  avgSubwordZipf: number;
  medianSubwordZipf: number;
  effortScore: number;
  difficultyScore: number;
  globalLevelNumber: number;
};


export type Chapter = {
  chapter: number;
  puzzles: Puzzle[];
};

export type TierData = {
  chapters: Chapter[];
};

export type PuzzlesByTier = {
  [tier: string]: TierData;
};

export type TierKey = "Tier0" | "Tier1" | "Tier2" | "Tier3" | "Tier4" | "Tier5" | "Tier6";

export type TierLabelsMap = {
  [key in TierKey]: string;
};

export type ChapterTelemetry = {
  sizeTarget: number;
  sizeActual: number;
  meanDifficulty: number;
  minDifficulty: number;
  maxDifficulty: number;
  difficultyStd: number;
  meanEffort: number;
  centers: Record<string, number>;
  usedFallback: boolean;
};

export type PuzzleChapter = {
  chapter: number;
  puzzles: Puzzle[];
  telemetry: ChapterTelemetry;
};

export type PuzzleBook = {
  totalChapters: number;
  chapters: PuzzleChapter[];
};
