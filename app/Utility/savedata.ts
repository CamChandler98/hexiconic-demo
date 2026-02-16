import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRESS_KEY = "puzzle-progress";
const CURRENT_INDEX_KEY = "puzzle-current-index";
const GAME_STATE_KEY = "game-state";
const DAILY_REWARD_KEY = "daily-reward-state";
const GEM_KEY = "global-gems";

export type PuzzleProgressEntry = {
  foundWords: string[];
  score: number;
  completed: boolean;
  bestTier?: string;
  activeHintWord?: string | null;
  revealedLetters?: string[];
  gemsEarned?: number;
  streakCount?: number;

  freeHintRerollUsed?: boolean; // NEW
  hintRerollCount?: number; // NEW (optional but handy)
};

function createDefaultProgress(): PuzzleProgressEntry {
  return {
    foundWords: [],
    score: 0,
    completed: false,
    gemsEarned: 0,
    activeHintWord: null,
    revealedLetters: [],
    streakCount: 0,

    freeHintRerollUsed: false,
    hintRerollCount: 0,
  };
}

export type PuzzleProgressMap = {
  [puzzleId: number]: PuzzleProgressEntry;
};

let progressUpdateQueue: Promise<void> = Promise.resolve();

const SAVE_DATA_KEYS = [
  PROGRESS_KEY,
  CURRENT_INDEX_KEY,
  GAME_STATE_KEY,
  DAILY_REWARD_KEY,
  GEM_KEY,
] as const;

// ---- LOAD ALL PROGRESS ----
export async function loadProgress(): Promise<PuzzleProgressMap> {
  const rawData = await AsyncStorage.getItem(PROGRESS_KEY);
  return rawData ? JSON.parse(rawData) : {};
}

// ---- SAVE ALL PROGRESS ----
export async function saveProgress(map: PuzzleProgressMap) {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
}

// ---- LOAD CURRENT PUZZLE INDEX ----
export async function loadCurrentPuzzleIndex(): Promise<number> {
  const raw = await AsyncStorage.getItem(CURRENT_INDEX_KEY);
  return raw ? Number(raw) : 0;
}

// ---- SAVE CURRENT PUZZLE INDEX ----
export async function saveCurrentPuzzleIndex(index: number) {
  await AsyncStorage.setItem(CURRENT_INDEX_KEY, index.toString());
}

export async function updatePuzzleProgress(
  puzzleId: number,
  updater: (entry: PuzzleProgressEntry) => PuzzleProgressEntry,
) {
  const run = progressUpdateQueue.then(async () => {
    const map = await loadProgress();

    const oldEntry: PuzzleProgressEntry = {
      ...createDefaultProgress(),
      ...(map[puzzleId] ?? {}),
    };

    const updatedEntry = updater(oldEntry);

    map[puzzleId] = {
      ...oldEntry,
      ...updatedEntry,
      // ensure gems always exists
      gemsEarned: updatedEntry.gemsEarned ?? oldEntry.gemsEarned ?? 0,
    };

    await saveProgress(map);
  });

  // Keep the queue alive even if one update throws.
  progressUpdateQueue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export type GameProgressState = {
  chapterIndex: number;
  puzzleIndex: number;
  puzzleId?: number;
  startedAt?: number;
  lastPlayedAt?: number;
  gameplayTutorialSeen?: boolean;
};

function createDefaultGameState(): GameProgressState {
  return {
    chapterIndex: 0,
    puzzleIndex: 0,
    startedAt: Date.now(),
    lastPlayedAt: Date.now(),
    gameplayTutorialSeen: false,
  };
}

export async function loadGameState(): Promise<GameProgressState> {
  const raw = await AsyncStorage.getItem(GAME_STATE_KEY);
  if (!raw) return createDefaultGameState();

  const parsed = JSON.parse(raw) as GameProgressState;
  return {
    ...createDefaultGameState(),
    ...parsed,
  };
}

export async function saveGameState(state: GameProgressState) {
  await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export async function updateGameState(
  updater: (state: GameProgressState) => GameProgressState,
) {
  const current = await loadGameState();
  const nextState = updater({
    ...current,
    lastPlayedAt: Date.now(),
  });

  const updated: GameProgressState = {
    ...current,
    ...nextState,
    lastPlayedAt: nextState.lastPlayedAt ?? Date.now(),
  };

  await saveGameState(updated);
}

export async function deleteSaveData() {
  const run = progressUpdateQueue.then(async () => {
    await AsyncStorage.multiRemove([...SAVE_DATA_KEYS]);
  });

  // Keep the queue alive even if one update throws.
  progressUpdateQueue = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}
