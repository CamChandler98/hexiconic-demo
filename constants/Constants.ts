import HexTileBasic from "@/assets/graphics/HexBasic.svg";
import HexTileBasicShadow from "@/assets/graphics/HexBasicShadow.svg";
import HexTileBlue from "@/assets/graphics/HexBlue.svg";
import HexTileGold from "@/assets/graphics/HexGold.svg";
import HexTileGray from "@/assets/graphics/HexGray.svg";
import HexTileGreen from "@/assets/graphics/HexGreen.svg";
import HexTileNavy from "@/assets/graphics/HexNavy.svg";
import HexTilePink from "@/assets/graphics/HexPink.svg";
import HexTilePurple from "@/assets/graphics/HexPurple.svg";
import { Colors } from "@/theme/colors";
import { TierLabelsMap } from "@/types/puzzle";
const tierGradient = (color: string) => [
  color + "33", // ~20% opacity
  "#ffffff",
];
export type TierKey =
  | "Tier0"
  | "Tier1"
  | "Tier2"
  | "Tier3"
  | "Tier4"
  | "Tier5"
  | "Tier6";

export type TierMap<T> = {
  [key in TierKey]: T;
};
export const GemTierColors: TierLabelsMap = {
  Tier0: Colors.gem.gray,
  Tier1: Colors.gem.pink,
  Tier2: Colors.gem.purple,
  Tier3: Colors.gem.yellow,
  Tier4: Colors.gem.green,
  Tier5: Colors.gem.navy,
  Tier6: Colors.gem.blue,
};
export const GemTierDescriptions: TierLabelsMap = {
  Tier0: "Gentle beginnings",
  Tier1: "Building confidence",
  Tier2: "Pattern mastery",
  Tier3: "Word intuition",
  Tier4: "Precision play",
  Tier5: "Deep vocabulary",
  Tier6: "Absolute mastery",
};
export const GemTierLabels: TierLabelsMap = {
  Tier0: "Quartz Cadet",
  Tier1: "Pearl Prospect",
  Tier2: "Amethyst Ace",
  Tier3: "Citrine Seer",
  Tier4: "Emerald Elite",
  Tier5: "Sapphire Sage",
  Tier6: "Diamond Dynamo",
};

// Central map of tier keys to tile SVG assets.
export const TierGraphics: TierMap<any> = {
  Tier0: HexTileGray,
  Tier1: HexTilePink,
  Tier2: HexTilePurple,
  Tier3: HexTileGold,
  Tier4: HexTileGreen,
  Tier5: HexTileNavy,
  Tier6: HexTileBlue,
};

// Default tile graphics for non-center letters.
export const BasicTileGraphic = HexTileBasic;
export const BasicTileShadowGraphic = HexTileBasicShadow;

export const PuzzleCompleteTier = "Tier3";
export const CHAPTER_UNLOCK_THRESHOLD = 0.6;
export const GEM_POINTS_RATE = 0.2;
export const GEMS_PER_HINT_LETTER = 5;
// Ordered list of tier keys used in tier comparison logic.
export const TIER_KEYS = Object.keys(GemTierLabels) as TierKey[];

export const GEMS_PER_REWARDED_AD = 20;

export const GEMS_DAILY_REWARD = 50;

// Base share of `totalPoints` required before difficulty modifiers.
export const COMPLETION_THRESHOLD = 0.4;
// Global-level easing controls: starts easier and ramps toward 1.0.
export const COMPLETION_SCALE_TOTAL_PUZZLES = 5000;
export const COMPLETION_SCALE_MAX_REDUCTION = 0.75;
export const COMPLETION_SCALE_EASE_OUT_AT = 700;
// Optional per-level completion multiplier overrides.
export const EARLY_LEVEL_COMPLETION_MULTIPLIER: Record<number, number> = {
  1: 0.2,
  2: 0.3,
  3: 0.4,
};

// Extra early-level completion reduction for high-density puzzles.
export const EARLY_SUBWORD_COMPLETION_BASELINE = 60;
export const EARLY_SUBWORD_COMPLETION_RANGE = 120;
export const EARLY_SUBWORD_COMPLETION_MAX_REDUCTION = 0.2;
export const EARLY_SUBWORD_COMPLETION_EASE_OUT_AT = 700;

export const REROLL_COST = 2;

// export const ShadowTile = require("@/assets/graphics/HexBasicShadow.png");
