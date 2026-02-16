export function shuffleKeepingCenter(word: string, centerLetter?: string): string {
  const letters = [...word];

  const CENTER_INDEX = 4; // visual center of the honeycomb

  // Remove center letter
  if (centerLetter) {
    const i = letters.indexOf(centerLetter);
    if (i !== -1) letters.splice(i, 1);
  } else {
    centerLetter = letters.splice(CENTER_INDEX, 1)[0];
  }

  // Shuffle outer letters
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }

  // Reinsert center letter at the visual center
  const rebuilt = [...letters];
  rebuilt.splice(CENTER_INDEX, 0, centerLetter);

  return rebuilt.join("");
}