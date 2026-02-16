function isPangram(word: string, letters: string[]): boolean {
  const set = new Set(word);
  return letters.every((l) => set.has(l));
}

function getHintCandidates(
  subwords: Record<string, number>,
  foundWords: string[],
  letters: string[],
) {
  const found = new Set(foundWords);
  const allWords = Object.keys(subwords);

  const remaining = allWords.filter((w) => !found.has(w));
  const pangrams = remaining.filter((w) => isPangram(w, letters));
  const nonPangrams = remaining.filter((w) => !isPangram(w, letters));

  return {
    remaining,
    pangrams,
    nonPangrams,
    remainingCount: remaining.length,
    completionRatio: foundWords.length / allWords.length,
  };
}

export function pickHintWordSafe(
  subwords: Record<string, number>,
  foundWords: string[],
  letters: string[],
): string | null {
  const { nonPangrams, pangrams, remainingCount, completionRatio } =
    getHintCandidates(subwords, foundWords, letters);

  if (nonPangrams.length > 0) {
    return nonPangrams[Math.floor(Math.random() * nonPangrams.length)];
  }

  // Offer pangrams only near puzzle completion.
  if (pangrams.length > 0 && (remainingCount <= 2 || completionRatio >= 0.9)) {
    return pangrams[Math.floor(Math.random() * pangrams.length)];
  }

  return null;
}

export function pickHintWordPreferLongSafe(
  subwords: Record<string, number>,
  foundWords: string[],
  letters: string[],
) {
  const { nonPangrams, pangrams, remainingCount, completionRatio } =
    getHintCandidates(subwords, foundWords, letters);

  const pool =
    nonPangrams.length > 0
      ? nonPangrams
      : remainingCount <= 2 || completionRatio >= 0.9
        ? pangrams
        : [];

  if (!pool.length) return null;

  pool.sort((a, b) => b.length - a.length);
  const cutoff = Math.ceil(pool.length / 2);
  return pool[Math.floor(Math.random() * cutoff)];
}

export function pickHighValueHintSafe(
  subwords: Record<string, number>,
  foundWords: string[],
  letters: string[],
) {
  const { nonPangrams, pangrams, remainingCount, completionRatio } =
    getHintCandidates(subwords, foundWords, letters);

  const sortedNonPangrams = nonPangrams.sort(
    (a, b) => subwords[b] - subwords[a],
  );

  if (sortedNonPangrams.length > 0) {
    return sortedNonPangrams[0];
  }

  // Offer pangram high-value hints only near completion.
  if (pangrams.length > 0 && (remainingCount <= 1 || completionRatio >= 0.95)) {
    return pangrams.sort((a, b) => subwords[b] - subwords[a])[0];
  }

  return null;
}

function median(nums: number[]) {
  if (!nums.length) return 0;
  const a = [...nums].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function weightedPick(words: string[], weights: number[]) {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total <= 0) return words[Math.floor(Math.random() * words.length)];
  let r = Math.random() * total;
  for (let i = 0; i < words.length; i++) {
    r -= weights[i];
    if (r <= 0) return words[i];
  }
  return words[words.length - 1];
}

export function pickHintWordFairSafe(
  subwords: Record<string, number>, // kept for signature consistency, not used
  foundWords: string[],
  letters: string[],
): string | null {
  const { nonPangrams, pangrams, remainingCount, completionRatio } =
    getHintCandidates(subwords, foundWords, letters);

  const pool =
    nonPangrams.length > 0
      ? nonPangrams
      : remainingCount <= 2 || completionRatio >= 0.9
        ? pangrams
        : [];

  if (!pool.length) return null;

  // Estimate preferred word length from previously found words.
  const foundLens = foundWords.map((w) => w.length).filter(Boolean);
  const targetLen = foundLens.length ? median(foundLens) : 4.5;

  // Length guardrails to avoid overly long hints early in progression.
  const maxLen =
    completionRatio < 0.25
      ? 6
      : completionRatio < 0.5
        ? 7
        : completionRatio < 0.75
          ? 9
          : 999;

  const filtered = pool.filter((w) => w.length <= maxLen);
  const finalPool = filtered.length ? filtered : pool;

  const weights = finalPool.map((w) => {
    const len = w.length;

    // Weight toward shorter words.
    const lenScore = 1 / Math.pow(len, 1.7);

    // Weight toward the player's current length preference.
    const dist = Math.abs(len - targetLen);
    const distScore = 1 / (1 + dist);

    // Small jitter to vary selections with equal scores.
    const jitter = 0.9 + Math.random() * 0.2;

    return clamp(lenScore * distScore * jitter, 0.0001, 10);
  });

  return weightedPick(finalPool, weights);
}
