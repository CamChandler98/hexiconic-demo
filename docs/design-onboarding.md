# Hexiconic Design and Onboarding Guide

This document is a fast-start map of the codebase for:

- New engineers joining the project
- AI coding agents that need reliable file-level orientation

It focuses on how the game actually works today in code, where core behavior lives, and where to make safe changes.

## 1. Product and Runtime Summary

Hexiconic is a React Native + Expo word game with:

- 7-letter honeycomb puzzles
- A required center letter
- Score-based completion (not full-word-list completion)
- Gem economy for hints/rerolls
- Daily reward + rewarded ad gem flow

Primary stack:

- Expo SDK 54 + React Native 0.81 + React 19
- Expo Router for file-based navigation
- AsyncStorage for all persistence
- Custom hooks for gameplay state, animation, and audio

Primary entry files:

- `app/_layout.tsx` (provider tree + route stack)
- `app/start/index.tsx` and `app/components/StartMenu/StartMenuContainer.tsx` (resume flow)
- `app/game/index.tsx` and `app/components/GameInterface/GameInterfaceContainer.tsx` (main gameplay loop)
- `app/continue/index.tsx` (advance to next puzzle)
- `app/end/index.tsx` (end-of-content screen)

## 2. Architectural Mental Model

Think of the app as four cooperating layers:

1. Content layer
- Pre-generated JSON puzzle data in `assets/data/`
- Runtime does not generate puzzles

2. Session/runtime layer
- `PuzzleContext` holds currently active puzzle object for navigation-bound play
- Screen-local state in gameplay container drives current input and UI feedback

3. Persistent progression layer
- AsyncStorage-backed progress map + game state in `app/Utility/savedata.ts`
- Hooks (`usePuzzleProgress`, `useHintProgress`, `useWordStreak`) read/write puzzle-scoped progress

4. UX systems layer
- Animation hooks in `app/hooks/animation/`
- Sound system via `SoundSettingsContext` + `useSoundEffect`
- Currency/reward flows via `CurrencyContext`, daily reward hook, and rewarded ads

## 3. Route and Screen Flow

High-level runtime flow:

1. App boot
- `app/_layout.tsx` loads fonts and mounts providers in this order:
  `SoundSettingsProvider -> DailyRewardProvider -> PuzzleProvider -> CurrencyProvider`

2. Start screen
- `app/start/index.tsx` renders `StartMenuContainer`
- `StartMenuContainer` loads saved chapter/puzzle index from `loadGameState()`
- It resolves the puzzle from `assets/data/reordered_chapters.json`
- It injects that puzzle into `PuzzleContext` and enables Continue

3. Game screen
- `app/game/index.tsx` reads `currentPuzzle` from context
- If null, redirects to `/`
- Otherwise renders `GameInterfaceContainer`

4. Completion transition
- Progress bar completion in gameplay triggers route replace to `/continue`
- `app/continue/index.tsx` increments puzzle/chapter in persisted game state, sets next puzzle in context, then navigates to `/game`
- If no chapter remains, route replaces to `/end`

5. Optional select routes
- Tier/chapter puzzle browsing exists in `app/puzzle_select/*`
- This path uses `generated_puzzles_buckets.json` and is separate from main linear progression flow

## 4. Key Directory Map

- `app/components/GameInterface/`
  Core game UI and orchestration (`GameInterfaceContainer.tsx`)
- `app/components/GameInterface/hooks/`
  Puzzle progress, hint progress, streak state hooks
- `app/context/`
  Cross-screen state: puzzle, gems, sound, daily reward
- `app/Utility/`
  Persistence, shuffle, hint pickers, completion math, small helpers
- `app/hooks/animation/`
  Reusable animation primitives
- `app/hooks/sounds/`
  SFX registry and playback hook
- `assets/data/`
  Puzzle datasets used by runtime
- `constants/Constants.ts`
  Economy/tier tuning constants
- `types/`
  Puzzle and reward type contracts

## 5. Main Gameplay Engine (GameInterfaceContainer)

`app/components/GameInterface/GameInterfaceContainer.tsx` is the behavior hub for active gameplay.

Responsibilities:

- Accept letter taps and build current input
- Validate submitted words against puzzle constraints
- Compute points/gems (including pangram + streak bonuses)
- Trigger reward toasts and fly-to-target animations
- Manage hint lifecycle (start hint, reveal letter, reroll)
- Coordinate progress bar completion and navigation
- Open shared modals (found words, get currency, tutorial)

Supporting hooks:

- `usePuzzleProgress(puzzle)`
  Loads/sanitizes saved words and score; persists additions
- `useHintProgress(puzzle)`
  Persists active hint word, revealed letters, reroll usage
- `useWordStreak(puzzleId)`
  Tracks/persists consecutive qualifying words and exposes streak tier/color

Important subcomponents:

- `BaseWordGrid.tsx` for honeycomb letter layout
- `InputWordContainer.tsx` for typed word display + error shake
- `CurrencyButtons.tsx` for hint/reroll/currency actions
- `FoundWordsList.tsx` modal for discovered words + points

## 6. Persistence Contracts (AsyncStorage)

All storage keys and update helpers are centralized in `app/Utility/savedata.ts`.

Current keys:

- `puzzle-progress`
  Map from `puzzleId -> PuzzleProgressEntry`
- `puzzle-current-index`
  Legacy/current-index key (not central to active chapter/puzzle flow)
- `game-state`
  Global chapter/puzzle pointer + tutorial flag + timestamps
- `daily-reward-state`
  Last claim timestamp for daily reward
- `global-gems`
  Currency balance

`updatePuzzleProgress` uses an internal promise queue to serialize writes and reduce race conditions between concurrent UI actions.

### Save schema notes

`PuzzleProgressEntry` currently includes:

- `foundWords`, `score`, `completed`
- `activeHintWord`, `revealedLetters`
- `gemsEarned`, `streakCount`
- `freeHintRerollUsed`, `hintRerollCount`

When extending schema:

1. Add optional fields first
2. Provide defaults in load paths
3. Avoid removing keys without migration logic

## 7. Puzzle Content and Data Model

Primary linear progression dataset:

- `assets/data/reordered_chapters.json`

Type model:

- `types/puzzle.ts` (`Puzzle`, `PuzzleBook`, `PuzzleChapter`, telemetry fields)

Current dataset stats (from local file inspection):

- Total chapters: 115
- Total puzzles: 5001
- Chapter size range currently starts at 5 and ends at 60

Secondary tier/chapter browsing dataset:

- `assets/data/generated_puzzles_buckets.json`
- Contains Tier0..Tier6 buckets, each with chapter arrays

## 8. Economy, Rewards, and Hint Rules

Tuning constants live in `constants/Constants.ts` and completion helpers in `app/Utility/completion.tsx`.

Core mechanics:

- Gem payout baseline uses `GEM_POINTS_RATE` (0.2) with minimum 1 gem/word
- Pangram bonus currently adds +3 gems
- Hint letter costs scale by level via `getHintLetterCost`
- Hint reroll can be free once, then paid via `getRerollCost`
- Completion score uses dynamic scaling based on level and subword count pressure

Hint word selection strategies are in `app/Utility/hints.ts`, with gameplay currently using `pickHintWordFairSafe`.

## 9. Currency and Monetization Flow

Currency state:

- `app/context/CurrencyContext.tsx` manages global gem balance

Get-currency UI:

- `app/components/General/GetCurrencyModal.tsx`

Reward paths:

1. Daily reward
- `useDailyReward` checks 24h cooldown using `daily-reward-state`

2. Rewarded ad
- `useRewardedAd` wraps ad lifecycle
- Native implementation: `ads/rewarded.native.ts`
- Web stub: `ads/rewarded.web.ts`

## 10. Audio and UX Infrastructure

Audio settings:

- `app/context/SoundSettingsContext.tsx`

Playback hook:

- `app/hooks/sounds/effects/useSoundEffect.ts`

Effect registry:

- `app/hooks/sounds/effects/index.ts`

Shared UI primitives:

- `app/components/General/ScreenHeader.tsx`
- `app/components/General/ProgressBar.tsx`
- `app/components/General/OptionsModal.tsx`
- `app/components/General/ui/AppText.tsx`

Theme tokens:

- `theme/colors.ts`, `theme/layout.ts`, `theme/typography.ts`

## 11. Fast "Where Do I Change X?" Index

- Word validation rules: `app/components/GameInterface/GameInterfaceContainer.tsx`
- Hint candidate algorithm: `app/Utility/hints.ts`
- Completion threshold math: `app/Utility/completion.tsx`
- Gem reward tuning: `constants/Constants.ts` and gameplay validation block
- Persisted progress schema: `app/Utility/savedata.ts`
- Continue-to-next-puzzle logic: `app/continue/index.tsx`
- Start/resume behavior: `app/components/StartMenu/StartMenuContainer.tsx`
- Header/options behavior: `app/components/General/ScreenHeader.tsx`, `app/components/General/OptionsModal.tsx`
- Ad behavior: `ads/rewarded.native.ts`, `app/hooks/useRewardedAd.ts`

## 12. Current Risks and Drift to Know

- Rule mismatch: README says words must be length >= 4, but gameplay validation currently only rejects `< 3` (`GameInterfaceContainer.tsx`).
- Two puzzle progression sources exist (`reordered_chapters.json` vs `generated_puzzles_buckets.json`), which can drift if both are used.
- No automated test suite is present right now (no test/spec files in repo).
- `index.js` references `./App`, while package entry uses `expo-router/entry`; this file appears legacy and can confuse newcomers.

## 13. AI Agent Quick-Start Workflow

For an AI agent making changes safely:

1. Read these files first:
- `app/_layout.tsx`
- `app/components/GameInterface/GameInterfaceContainer.tsx`
- `app/Utility/savedata.ts`
- `constants/Constants.ts`
- `types/puzzle.ts`

2. Confirm whether change is:
- Gameplay rule change
- Persistence/schema change
- UI-only change
- Navigation/progression change

3. If persistence is touched:
- Keep backward compatibility with optional fields
- Avoid removing keys without migration strategy

4. Verify manually on at least:
- Start -> Game -> Continue flow
- Hint purchase and reroll
- Daily reward claim
- Save reset in Options modal

## 14. Local Dev Commands

From `package.json`:

- `npm run start`
- `npm run ios`
- `npm run android`
- `npm run web`
- `npm run lint`

