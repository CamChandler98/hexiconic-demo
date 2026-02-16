# Copilot / AI Agent Instructions

Purpose: help an AI agent be productive immediately in this Expo + React Native game project.

- **Big picture**: This is an Expo + React Native app using file-based routing (Expo Router) under `app/`. The root layout and global providers are in `app/_layout.tsx` which composes `SoundSettings`, `DailyReward`, `Puzzle`, and `Currency` providers.

- **Where gameplay data lives**: puzzles are pre-generated JSON shipped in `assets/data/` (e.g. `generated_puzzles.json`, `generated_puzzles_shuffled.json`, `reordered_chapters.json`). Treat these as the canonical content source; puzzle generation happens outside this repo.

- **Routing & entry**: the Expo Router entry is `expo-router/entry` (see `package.json` `main`). Screens live under `app/` and follow file-based routes (e.g. `app/start`, `app/continue`, `app/game`). `app/index.tsx` renders the Start screen.

- **State & persistence patterns**:
  - Lightweight React Context providers under `app/context/*` persist small user state to `AsyncStorage` (examples: `CurrencyContext.tsx`, `SoundSettingsContext.tsx`). Follow those patterns when adding new persisted global state.
  - `PuzzleProvider` holds the currently active puzzle (see `app/context/PuzzleContext.tsx`). Per-puzzle progress is stored separately in utilities under `Utility/` and persisted files.

- **Key integration points**:
  - Ads: `ads/rewarded.native.ts` implements rewarded ads via `react-native-google-mobile-ads`. Use the `useRewardedAd` hook in `app/hooks` which wraps `createRewardedAd`.
  - Native asset handling: `metro.config.js` configures `react-native-svg-transformer` and custom `sourceExts` for `.svg` imports (components import SVGs from `assets/graphics/`).
  - Absolute imports use the `@/*` path alias (see `tsconfig.json`).

- **Build / dev / scripts** (from `package.json`):
  - `npm run start` — starts Expo dev server
  - `npm run ios` — run on iOS simulator (requires native deps installed)
  - `npm run android` — run on Android
  - `npm run web` — run web build
  - `npm run reset-project` — project-specific reset helper (`scripts/reset-project.js`)
  - `npm run "wipe ios"` — convenience to uninstall the app from the booted iOS simulator

- **Native dependency notes**:
  - When adding native packages run `cd ios && pod install` and rebuild the dev client if using `expo-dev-client`.
  - iOS includes Google Mobile Ads in `ios/Pods` — tests use `TestIds.REWARDED` for ads.

- **Patterns and conventions to follow**:
  - Keep providers lightweight and prefer `AsyncStorage` for small persisted pieces (see `SoundSettingsContext.tsx` and `CurrencyContext.tsx`).
  - Use the `@/` alias for imports (e.g. `import { Layout } from "@/theme/layout"`).
  - UI components are small and presentational; business logic and scoring lives in `Utility/` and `constants/` (see `constants/Constants.ts`).
  - Use `expo-font` loader in `app/_layout.tsx` — avoid rendering until fonts load.

- **Files worth inspecting for examples**:
  - `app/_layout.tsx` — app root + providers
  - `app/index.tsx`, `app/start/index.tsx` — routing entry and start screen
  - `app/context/*.tsx` — persistence + context patterns
  - `ads/rewarded.native.ts` and `app/hooks/useRewardedAd.ts` — ad integration pattern
  - `assets/data/generated_puzzles*.json` — canonical puzzle content
  - `metro.config.js` — svg transformer setup
  - `tsconfig.json` — path alias `@/*`

- **Common developer tasks an agent may perform**:
  - Add a small persisted setting: copy `SoundSettingsContext.tsx` pattern and use `AsyncStorage` key versioning.
  - Add a new screen: create `app/<name>/index.tsx` and rely on Expo Router; export default a React component and the route will appear.
  - Modify puzzles: edit or add files under `assets/data/` — note puzzles are large JSON arrays and curated externally.

- **Do not assume runtime generators**: puzzles and chapters are pre-built; do not add runtime generators unless explicitly wiring up an external generator.

If anything is unclear or you want more detail on a particular area (ads, save format, provider patterns, or how puzzles are loaded), tell me which section to expand and I will iterate.
