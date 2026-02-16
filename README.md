# Hexiconic

Hexiconic is a relaxing, gem-themed word puzzle game built for players who enjoy thoughtful progression, tactile feedback, and more than a single daily puzzle. Each puzzle challenges you to uncover words from a constrained letter set while earning gems, using hints strategically, and progressing through a carefully curated chapter system.

The game is designed to feel calm and rewarding rather than punishing, with flexible completion rules and a focus on forward momentum instead of perfection.

> **Status:** Active development  
> **Platform:** Mobile (React Native / Expo)

---

## Gameplay Overview

Each puzzle in Hexiconic follows a consistent, approachable rule set:

- Each puzzle contains **seven letters**
- One letter is designated as the **required center letter**
- All valid words must:
  - Contain the center letter
  - Be at least 4 letters long
- Letters may be reused any number of times
- **Points scale with word length**
- **Gems scale with word length**
- A puzzle is completed when the player reaches a **percentage-based score threshold**, not necessarily 100% of available points

This completion model ensures puzzles with fewer valid words still feel fair and satisfying to finish.

---

## Progression Loop

Hexiconic is structured around a linear, curated progression model:

1. Play a puzzle and discover words
2. Earn points and gems per word
3. Use gems to reveal hint letters when needed
4. Reach the puzzle’s completion threshold
5. Transition to a completion screen
6. Continue seamlessly into the next puzzle

Puzzles are grouped into **chapters**, and chapters are ordered to create a smooth difficulty curve rather than relying on rigid difficulty tiers.

---

## Hints & Economy

- Players earn **gems** naturally by finding words
- Gems can be spent to reveal letters from unrevealed valid words
- The hint system is designed to:
  - Prevent dead-ends
  - Encourage strategic spending
  - Preserve the feeling of discovery rather than brute-forcing solutions

Gems earned per puzzle are tracked independently, making future meta-systems (stores, unlocks, modifiers) possible without rewriting core logic.

---

## Puzzle Generation & Curation

Hexiconic uses a **custom Python puzzle generator** (maintained outside this repo) to create its content pipeline.

That pipeline includes:

- Dictionary parsing and filtering
- Word frequency analysis
- Profanity detection and whitelisting
- Subword scoring
- Puzzle telemetry collection
- Difficulty scoring
- Chapter reconstruction based on global puzzle metrics

Rather than generating puzzles randomly at runtime, Hexiconic ships with **pre-generated, telemetry-aware puzzle data**, allowing for consistent pacing and intentional difficulty progression.

---

## Tech Stack

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage

### Architecture

- Component-driven UI
- Custom hooks for:
  - animations
  - currency handling
  - puzzle progress
- Isolated utility modules for:
  - validation
  - scoring
  - hint selection
- Clear separation between game state, UI state, and persistence

### Tooling

- Custom Python generator
- Custom telemetry tracker
- Chapter rebuilding and ordering scripts

---

## Save System

Hexiconic maintains two parallel save layers:

### Per-Puzzle Progress

- Found words
- Score
- Gems earned
- Hint state
- Completion flag

### Global Game State

- Current chapter index
- Current puzzle index
- Session timestamps

This structure allows:

- seamless “Continue” functionality
- mid-puzzle recovery
- future replay / remix modes without breaking saves

---

## Visuals

> Screenshots and gifs coming soon

Planned:

- Puzzle gameplay
- Hint reveal animation
- Completion screen
- Chapter progression UI

---

## Current Focus / Next Steps

- Visual polish for completion and continue screens
- Chapter-level progress feedback
- Light narrative or collection-based meta layer
- Long-term replay modes (e.g. Zen / Remix)

---

## Why This Project Exists

Hexiconic is both:

- a **complete, playable game**
- a **demonstration of systems-driven design**

It explores:

- procedural content generation
- telemetry-informed curation
- clean React Native architecture
- balancing player agency with guided progression

---

Built with care by Cam Chandler.
