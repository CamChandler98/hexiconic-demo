export const SoundEffects = {
  tap: {
    normal: require("@/assets/sounds/effects/tap/TapSound-1.mp3"),
    center: require("@/assets/sounds/effects/tap/GemPing.mp3"), 
  },
  validate: {
    fail: {
      soft: require("@/assets/sounds/effects/ui/FailChime-2.mp3")
    }
  },
  rewards :{
    hintReveal: require("@/assets/sounds/effects/ui/HintReveal.mp3"),
    correct: {
      normal: require("@/assets/sounds/effects/rewards/SuccessChime-normal.mp3"),
      extra: require("@/assets/sounds/effects/rewards/SuccessChime-extra.mp3"),
      pangram :require("@/assets/sounds/effects/rewards/SuccessChime-pangram.mp3")
    }
  },
  ui: {
    shuffle: require("@/assets/sounds/effects/ui/ShuffleChunk.mp3"),
    delete: require("@/assets/sounds/effects/ui/DeleteClick.mp3"),
    openFoundWords: require("@/assets/sounds/effects/ui/FoundWordsOpen.mp3"),
    close: require("@/assets/sounds/effects/ui/CloseThunk.mp3")
  }
};