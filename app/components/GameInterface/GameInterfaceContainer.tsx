import { useCurrency } from "@/app/context/CurrencyContext";
import { useFlyToTargetAnimation } from "@/app/hooks/animation/useFlyToTarget";
import { pickHintWordFairSafe } from "@/app/Utility/hints";
import { loadGameState, updateGameState } from "@/app/Utility/savedata";
import { shuffleKeepingCenter } from "@/app/Utility/Shuffle";
import {
  GEM_POINTS_RATE,
  GEMS_PER_HINT_LETTER,
  GemTierColors,
  GemTierLabels,
  REROLL_COST,
  TIER_KEYS,
  TierKey,
} from "@/constants/Constants";
import { Colors } from "@/theme/colors";
import { Puzzle } from "@/types/puzzle";
import { WordReward } from "@/types/reward";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Button,
  Dimensions,
  Easing,
  Platform,
  View,
} from "react-native";
import { GemCounter } from "../General/GemCounter";
import { GetCurrencyButtonRaw } from "../General/GetCurrencyButton";
import { GetCurrencyModal } from "../General/GetCurrencyModal";
import { HeaderRightGroup } from "../General/HeaderRightGroup";
import type { ProgressBarHandle } from "../General/ProgressBar";
import { ProgressBar } from "../General/ProgressBar";
import { ScreenHeader } from "../General/ScreenHeader";
import { BaseWordGrid } from "./BaseWordGrid";
import { CurrencyButtons } from "./CurrencyButtons";
import { FoundWordsButton } from "./FoundWordsButton";
import { FoundWordsModal } from "./FoundWordsList";
import { GameplayTutorialModal } from "./GameplayTutorialModal";
import { usePuzzleProgress } from "./hooks/usePuzzleProgress";
import { InputButtons } from "./InputButtons";
import type { InputWordHandle } from "./InputWordContainer";
import { InputWordContainer } from "./InputWordContainer";
import { PopupContainer } from "./Popup";
import { RevealedHintContainer } from "./RevealedHintContainer";
import { WordRewardToast, type WordRewardToastStreak } from "./WordRewardToast";

import { getHintLetterCost, getRerollCost } from "@/app/Utility/completion";
import { darkenColor } from "@/app/Utility/ui";
import { useHintProgress } from "./hooks/useHintProgress";
import { useWordStreak } from "./hooks/useWordStreak";
import StreakIndicator from "./StreakIndicator";

type GameInterfaceProps = {
  puzzle: Puzzle;
  forceMaxStreakLevel?: boolean;
  disableGameplayTutorial?: boolean;
};

type SubmitButtonProps = {
  onPress: () => void;
};

export const SubmitButton = ({ onPress }: SubmitButtonProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Check" onPress={onPress} />
    </View>
  );
};

export const GameInterfaceContainer = ({
  puzzle,
  forceMaxStreakLevel = false,
  disableGameplayTutorial = false,
}: GameInterfaceProps) => {
  const { baseword, letters } = puzzle;

  const { addGems, spendGems } = useCurrency();

  const progress = usePuzzleProgress(puzzle);

  const {
    hasStreak,
    streakNumber,
    streakProgressName,
    streakProgressColor,
    updateStreak,
    resetStreak,
    tier: streakTier,
  } = useWordStreak(puzzle.id, { forceMaxStreakLevel });

  const {
    activeHintWord,
    revealedLetters,
    freeHintRerollUsed,
    rerollHint,
    startHint,
    revealLetter,
    clearHint,
  } = useHintProgress(puzzle);

  const inputWordRef = useRef<InputWordHandle>(null);
  // const progressBarRef = useRef<View>(null);

  const progressBarHandleRef = useRef<ProgressBarHandle>(null);
  const progressBarViewRef = useRef<View>(null);

  const gemCounterRef = useRef<View>(null);

  const [currentInput, setCurrentInput] = useState("");
  const [subwords, setSubwords] = useState<{ [w: string]: number }>({});
  const [activeReward, setActiveReward] = useState<WordReward | null>(null);
  const [displayGemCurrencyTotal, setDisplayGemCurrencyTotal] =
    useState<number>(0);
  const [gemCurrencyTotal, setGemCurrencyTotal] = useState<number>(0);

  const [progressColor, setProgressColor] = useState(GemTierColors["Tier0"]);
  const [feedback, setFeedback] = useState<{ msg: string; id: number } | null>(
    null,
  );
  const [activeRewardStreak, setActiveRewardStreak] =
    useState<WordRewardToastStreak | null>(null);
  const [tierLabel, setTierLabel] = useState<string>(GemTierLabels["Tier0"]);
  const [tier, setTier] = useState<TierKey>("Tier0");
  const [tierUpAnimationKey, setTierUpAnimationKey] = useState(0);
  const [displayLetters, setDisplayLetters] = useState(
    shuffleKeepingCenter(letters.join(""), puzzle.center),
  );
  const shuffleGridProgress = useRef(new Animated.Value(0)).current;
  const shuffleGridAnimationRef = useRef<Animated.CompositeAnimation | null>(
    null,
  );

  const [progressTarget, setProgressTarget] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [gemTarget, setGemTarget] = useState<{ x: number; y: number } | null>(
    null,
  );

  const [showFoundWordsModal, setShowFoundWordsModal] = useState(false);
  const [showGetCurrencyModal, setShowGetCurrencyModal] = useState(false);
  const [showGameplayTutorial, setShowGameplayTutorial] = useState(false);
  const [tutorialReady, setTutorialReady] = useState(false);

  const hintLetterCost = getHintLetterCost(
    puzzle.globalLevelNumber,
    GEMS_PER_HINT_LETTER,
  );
  const rerollCost = getRerollCost(puzzle.globalLevelNumber, REROLL_COST);

  function pickHintExcluding(
    picker: () => string | null,
    exclude?: string | null,
    tries = 5,
  ) {
    const ex = exclude ?? null;
    let picked: string | null = null;

    for (let i = 0; i < tries; i++) {
      const p = picker();
      if (!p) return null;
      if (p !== ex) return p;
      picked = p;
    }

    // If we keep hitting the same value, just return the last picked.
    return picked;
  }

  const triggerTestReward = () => {
    const points = 12;
    const gems = 5;

    const reward: WordReward = {
      points,
      gems,
      isPangram: false,
      length: 6,
    };

    setActiveReward(reward);
    setActiveRewardStreak(null);

    const start = {
      x: Dimensions.get("window").width / 2,
      y: 300,
    };

    flyPoints.play(points, start, {
      onComplete: () => {
        progressBarHandleRef.current?.pop();
      },
    });

    flyGems.play(gems, start);
  };

  const handleRerollHintPress = () => {
    if (!activeHintWord) return;

    const cost = freeHintRerollUsed ? rerollCost : 0;

    // Pick a different word
    const picked = pickHintExcluding(
      () => pickHintWordFairSafe(subwords, progress.foundWords, puzzle.letters),
      activeHintWord,
    );

    if (!picked) {
      triggerPopup("No hints left!");
      return;
    }

    if (cost > 0 && !spendGems(cost)) {
      triggerPopup("Not enough gems");
      return;
    }

    // Reset and start the new hint word (reroll = new hint)
    rerollHint(picked);

    // Reveal the first letter immediately for consistency with startHint flow
    const firstKey = revealNextHintLetter(picked, []);
    if (firstKey) revealLetter(firstKey);
  };

  const handleHintPress = () => {
    // Case 1: no active hint.
    if (!activeHintWord) {
      const picked = pickHintExcluding(
        () =>
          pickHintWordFairSafe(subwords, progress.foundWords, puzzle.letters),
        activeHintWord,
      );

      if (!picked) {
        triggerPopup("No hints left!");
        return;
      }

      if (!spendGems(hintLetterCost)) {
        triggerPopup("Not enough gems");
        return;
      }

      startHint(picked);

      const firstKey = revealNextHintLetter(picked, []);
      if (firstKey) {
        revealLetter(firstKey);
      }

      return;
    }

    // Case 2: reveal the next letter for the active hint.
    const nextLetter = revealNextHintLetter(activeHintWord, revealedLetters);

    if (!nextLetter) {
      triggerPopup("All letters revealed!");
      return;
    }

    if (!spendGems(hintLetterCost)) {
      triggerPopup("Not enough gems");
      return;
    }

    revealLetter(nextLetter);
  };

  const handlerLetterPress = (letter: string) => {
    setCurrentInput((prev) => prev + letter);
  };

  const handleDeletePress = () => {
    setCurrentInput((prev) => prev.slice(0, -1));
  };

  const animateShuffleGrid = () => {
    shuffleGridAnimationRef.current?.stop();
    shuffleGridProgress.stopAnimation();
    shuffleGridProgress.setValue(0);

    setDisplayLetters(shuffleKeepingCenter(letters.join(""), puzzle.center));

    const subtleShake = Animated.sequence([
      Animated.timing(shuffleGridProgress, {
        toValue: 4,
        duration: 35,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shuffleGridProgress, {
        toValue: -4,
        duration: 55,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shuffleGridProgress, {
        toValue: 3,
        duration: 45,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shuffleGridProgress, {
        toValue: -2,
        duration: 40,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(shuffleGridProgress, {
        toValue: 0,
        duration: 35,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    shuffleGridAnimationRef.current = subtleShake;
    subtleShake.start(() => {
      shuffleGridProgress.setValue(0);
    });
  };

  const handleShufflePress = () => {
    animateShuffleGrid();
  };

  const handleSubmitPress = () => {
    validateWord(currentInput);
    setCurrentInput("");
  };

  const dismissGameplayTutorial = useCallback(async () => {
    setShowGameplayTutorial(false);
    try {
      await updateGameState((state) => ({
        ...state,
        gameplayTutorialSeen: true,
      }));
    } catch (error) {
      console.error("Failed to persist tutorial state", error);
    }
  }, []);

  const handleCurrencyPress = () => {};
  const triggerPopup = (message: string) => {
    setFeedback({ msg: message, id: Date.now() });
    setCurrentInput("");
  };

  const scoreWord = (word: string): number => {
    return subwords[word] ?? 0;
  };

  function bestTierAfterUpdate(prevTier: string | undefined, newTier: string) {
    if (!prevTier) return newTier;
    return TIER_KEYS.indexOf(newTier as TierKey) >
      TIER_KEYS.indexOf(prevTier as TierKey)
      ? newTier
      : prevTier;
  }

  const isPangram = (word: string, letters: string[]) => {
    const wordSet = new Set(word.split(""));
    for (const letter of letters) {
      if (!wordSet.has(letter)) return false;
    }
    return true;
  };

  function revealNextHintLetter(word: string, revealed: string[]) {
    const remaining = word
      .split("")
      .filter((letter, i) => !revealed.includes(letter + i));

    if (remaining.length === 0) return null;

    // Pick a random unrevealed index
    const indices = word
      .split("")
      .map((letter, i) => ({ letter, key: letter + i }))
      .filter(({ key }) => !revealed.includes(key));

    const choice = indices[Math.floor(Math.random() * indices.length)];
    return choice.key;
  }

  const failValidation = (message: string) => {
    // resetStreak();
    inputWordRef.current?.error();
    triggerPopup(message);
  };

  const validateWord = async (word: string) => {
    if (word.length < 3) {
      resetStreak();
      failValidation("Too short");
      return false;
    }
    if (progress.foundWords.includes(word)) {
      failValidation("Already found");
      return false;
    }
    if (!word.includes(puzzle.center)) {
      resetStreak();
      failValidation("Missing center letter");
      return false;
    }
    if (!(word in subwords)) {
      resetStreak();
      failValidation("Not in word list");
      return false;
    }

    const pangram = isPangram(word, puzzle.letters);

    const getBonusPoints = () => {
      let bonusPoints = 0;

      bonusPoints += streakNumber;

      return bonusPoints;
    };

    const points =
      (pangram ? scoreWord(word) * 2 : scoreWord(word)) + getBonusPoints();

    const streakResult = updateStreak(word);
    // console.log(streakResult);
    // 3. Handle Streak Rewards / Feedback
    let streakBonusGems = 0;
    let streakToastData: WordRewardToastStreak | null = null;

    if (streakResult.status === "initiated") {
      streakToastData = {
        status: "initiated",
        streakNumber: streakResult.streakNumber,
        bonusGems: 0,
        accentColor: streakResult.streakProgressColor,
      };
    } else if (streakResult.status === "maintained") {
      streakBonusGems = 1; // Example: Give 1 extra gem per streak word
      streakToastData = {
        status: "maintained",
        streakNumber: streakResult.streakNumber,
        bonusGems: streakBonusGems,
        accentColor: streakResult.streakProgressColor,
      };
    } else if (streakResult.status === "broken") {
      // Optional feedback hook when a streak is broken.
      // triggerPopup("Streak Broken");
    }

    const baseGems = Math.max(1, Math.ceil(points * GEM_POINTS_RATE));

    const pangramBonus = pangram ? 3 : 0;

    const rawGemsFromWord = points * GEM_POINTS_RATE;

    const gemsFromWord = baseGems + pangramBonus + streakBonusGems;
    const reward: WordReward = {
      points,
      gems: gemsFromWord,
      isPangram: pangram,
      length: word.length,
    };

    setActiveReward(reward);
    setActiveRewardStreak(streakToastData);
    addGems(gemsFromWord);

    const start = {
      x: Dimensions.get("window").width / 2,
      y: 300, // roughly where the input sits
    };

    flyPoints.play(points, start, {
      onComplete: () => {
        // progressBarHandleRef.current?.pop();
      },
    });

    flyGems.play(gemsFromWord, start, {
      onComplete: () => {
        // Reserved for a future gem counter pulse animation.
      },
    });

    // requestAnimationFrame(() => {
    //    progressBarHandleRef.current?.pop();
    // });

    // Clear hint if applicable
    if (word === activeHintWord) {
      clearHint();
    }

    await progress.addFoundWord(word, points, reward.gems);

    // Check the completion result directly.
    // if (isComplete) {
    //   router.replace("/continue");
    // }

    return true;
  };

  // Simplified and typed return
  function getTier(score: number, tiers: number[]): TierKey {
    // If score hits final threshold → highest tier (index + 1)
    if (score >= tiers[tiers.length - 1]) {
      return `Tier${tiers.length}` as TierKey;
    }

    // Walk backward through thresholds
    for (let i = tiers.length - 2; i >= 0; i--) {
      if (score >= tiers[i]) {
        return `Tier${i + 1}` as TierKey;
      }
    }

    // Below first threshold → Tier0
    return "Tier0";
  }

  function getTierLabel(score: number, tiers: number[]): string {
    const currentTierKey = getTier(score, tiers);
    return GemTierLabels[currentTierKey];
  }

  function getTierProgress(score: number, tiers: number[]) {
    // Tier0 case (before first threshold)
    if (score < tiers[0]) {
      return {
        current: score,
        total: tiers[0],
        nextThreshold: tiers[0],
      };
    }

    // Between tiers
    for (let i = 1; i < tiers.length; i++) {
      if (score < tiers[i]) {
        const prev = tiers[i - 1];
        const next = tiers[i];
        return {
          current: score - prev,
          total: next - prev,
          nextThreshold: next,
        };
      }
    }

    // Final tier (completed)
    const last = tiers[tiers.length - 1];
    return {
      current: last,
      total: last,
      nextThreshold: last,
    };
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      progressBarViewRef.current?.measureInWindow((x, y, width, height) => {
        setProgressTarget({
          x: x + width / 2,
          y: y + height / 2,
        });
      });

      gemCounterRef.current?.measureInWindow((x, y, width, height) => {
        setGemTarget({
          x: x + width / 2,
          y: y + height / 2,
        });
      });
    });
  }, []);

  useEffect(() => {
    setSubwords(puzzle.subwords);
  }, []);

  useEffect(() => {
    if (disableGameplayTutorial) {
      setShowGameplayTutorial(false);
      setTutorialReady(true);
      return;
    }

    let active = true;

    const loadTutorialState = async () => {
      try {
        const state = await loadGameState();
        if (!active) return;
        setShowGameplayTutorial(!state.gameplayTutorialSeen);
      } catch (error) {
        console.error("Failed to load tutorial state", error);
      } finally {
        if (active) setTutorialReady(true);
      }
    };

    loadTutorialState();

    return () => {
      active = false;
    };
  }, [disableGameplayTutorial]);

  useEffect(() => {
    return () => {
      shuffleGridAnimationRef.current?.stop();
      shuffleGridProgress.stopAnimation();
    };
  }, [shuffleGridProgress]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return undefined;

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (tutorialReady && showGameplayTutorial) {
            dismissGameplayTutorial();
            return true;
          }

          if (showGetCurrencyModal) {
            setShowGetCurrencyModal(false);
            return true;
          }

          if (showFoundWordsModal) {
            setShowFoundWordsModal(false);
            return true;
          }

          return false;
        },
      );

      return () => {
        subscription.remove();
      };
    }, [
      tutorialReady,
      showGameplayTutorial,
      dismissGameplayTutorial,
      showGetCurrencyModal,
      showFoundWordsModal,
    ]),
  );

  const flyPoints = useFlyToTargetAnimation({
    target: progressTarget,
    color: progressColor,
  });

  const flyGems = useFlyToTargetAnimation({
    target: gemTarget,
    color: "#4E6DC4",
  });

  const shuffleGridAnimatedStyle = useMemo(() => {
    return {
      transform: [{ translateX: shuffleGridProgress }],
    };
  }, [shuffleGridProgress]);

  // const tierProgress = getTierProgress(
  //   score,
  //   puzzle.tiers_generous
  // );

  const gameHeaderRight = (
    <HeaderRightGroup>
      <View ref={gemCounterRef}>
        <GemCounter />
      </View>
      <GetCurrencyButtonRaw
        onPress={() => {
          setShowGetCurrencyModal(true);
        }}
      />
    </HeaderRightGroup>
  );
  const isHintComplete =
    !!activeHintWord &&
    revealNextHintLetter(activeHintWord, revealedLetters) == null;
  const rerollLabel = freeHintRerollUsed ? `${rerollCost} gems` : "Free";
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader rightSlot={gameHeaderRight} />

      <View style={{ alignItems: "center" }}>
        {feedback && (
          <PopupContainer
            key={feedback.id}
            message={feedback.msg}
            onComplete={() => setFeedback(null)}
          />
        )}
        <View style={{ width: "75%", marginTop: 40 }} ref={progressBarViewRef}>
          <View style={{ position: "relative" }}>
            <ProgressBar
              ref={progressBarHandleRef}
              current={Math.min(progress.score, progress.completionScore)}
              total={progress.completionScore}
              height={25}
              // color={saturateColor(streakProgressColor, 1)}
              color={streakProgressColor}
              backgroundColor="#CFCFCF"
              showLabel={true}
              onAnimationComplete={() => {
                if (progress.completed) router.replace("/continue");
              }}
            />

            <View style={{ position: "absolute", right: 0, top: -12 }}>
              <StreakIndicator
                hasStreak={hasStreak}
                streakNumber={streakNumber}
                streakColor={streakProgressColor}
                outerFill={streakProgressColor}
                innerFill={darkenColor(streakProgressColor, 0.2)}
                iconSize={20}
                badgeSize={20}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 6,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT: score */}
            {/* <AppText variant="bodySmall" style={{ color: "#888" }}>
            {progress.score} / {completionScore}
      </AppText> */}

            {/* RIGHT: action buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8, // Horizontal spacing between action buttons.
              }}
            >
              <FoundWordsButton
                found={progress.foundWords.length}
                total={Object.keys(subwords).length}
                onPress={() => setShowFoundWordsModal(true)}
                color={Colors.interactive.primaryMuted}
              />
            </View>
          </View>
        </View>
        {/* <TierLabel label={tierLabel} /> */}
        {
          <RevealedHintContainer
            hintWord={activeHintWord}
            revealedLetters={revealedLetters}
          />
        }

        <InputWordContainer
          word={currentInput}
          centerLetter={puzzle.center}
          centerLetterColor={streakProgressColor}
          ref={inputWordRef}
        />
      </View>

      <Animated.View
        style={[shuffleGridAnimatedStyle, { zIndex: 0, elevation: 0 }]}
      >
        <BaseWordGrid
          key={tierUpAnimationKey}
          tier={streakTier}
          centerLetter={puzzle.center}
          letters={displayLetters.split("")}
          onPress={handlerLetterPress}
          animateOnMount
        />
      </Animated.View>

      <InputButtons
        onDelete={handleDeletePress}
        onSubmit={handleSubmitPress}
        onShuffle={handleShufflePress}
      />
      <CurrencyButtons
        onClickHint={handleHintPress}
        hintDisabled={isHintComplete}
        onClickReroll={handleRerollHintPress}
        showReroll={!!activeHintWord}
        rerollLabel={rerollLabel}
        onClickCurrency={() => {
          setShowGetCurrencyModal(true);
        }}
      />
      {activeReward && (
        <WordRewardToast
          reward={activeReward}
          streak={activeRewardStreak}
          onComplete={() => {
            setActiveReward(null);
            setActiveRewardStreak(null);
          }}
        />
      )}
      {/* {__DEV__ && (
        <View style={{ marginTop: 8, marginBottom: 4 }}>
          <Button
            title="Found Words Modal Debug"
            onPress={() => router.push("/debug/found-words")}
          />
        </View>
      )} */}
      {/* <GoCompletionButton puzzleId={puzzle.id} />
      <TriggerRewardButton onPress={triggerTestReward} /> */}
      <FoundWordsModal
        visible={showFoundWordsModal}
        onClose={() => setShowFoundWordsModal(false)}
        words={progress.foundWords}
        wordScores={puzzle.subwords}
      />
      <GetCurrencyModal
        visible={showGetCurrencyModal}
        onClose={() => setShowGetCurrencyModal(false)}
      />
      <GameplayTutorialModal
        visible={
          !disableGameplayTutorial && tutorialReady && showGameplayTutorial
        }
        onSkip={dismissGameplayTutorial}
        onComplete={dismissGameplayTutorial}
      />
      {flyPoints.AnimatedNode}
      {flyGems.AnimatedNode}

      {/* <ScreenFooter /> */}
    </View>
  );
};

export default GameInterfaceContainer;
