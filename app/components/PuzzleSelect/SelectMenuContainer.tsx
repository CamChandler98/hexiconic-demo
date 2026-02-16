import { usePuzzleContext } from "@/app/context/PuzzleContext";
import { loadProgress, PuzzleProgressMap } from "@/app/Utility/savedata";
import { Puzzle } from "@/types/puzzle";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { PuzzleCard } from "./PuzzleCard";

interface SelectMenuContainerProps {
  puzzles: Puzzle[];
  displayLetters: string[];
}

export const SelectMenuContainer = ({
  puzzles,
  displayLetters,
}: SelectMenuContainerProps) => {
  const router = useRouter();
  const [progress, setProgress] = useState<PuzzleProgressMap>({});
  const { setCurrentPuzzle } = usePuzzleContext();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        const saved = await loadProgress();
        if (isActive) {
          setProgress(saved);
        }
      }

      load();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleSelectPuzzle = (puzzle: Puzzle) => {
    setCurrentPuzzle(puzzle);
    router.push("/game");
  };

  const renderItem = ({ item, index }: { item: Puzzle; index: number }) => {
    const data = progress[item.id];
    const bestTier = data?.bestTier
      ? Number(data.bestTier.replace("Tier", ""))
      : 0;

    const score = data?.score ?? 0;
    const puzzleDisplayLetters = displayLetters[index]?.split("") ?? [];

    return (
      <PuzzleCard
        id={item.id}
        displayId={String(index + 1)}
        baseword={item.baseword}
        unlocked={true} // All puzzles are currently selectable.
        bestTier={bestTier}
        score={score}
        totalPoints={item.totalPoints}
        letters={puzzleDisplayLetters}
        centerLetter={item.center}
        onPress={() => handleSelectPuzzle(item)}
      />
    );
  };

  return (
    <FlatList
      horizontal
      data={puzzles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        alignItems: "center",
      }}
      initialNumToRender={3} // Keep initial render small for faster first paint.
      windowSize={5} // Keep nearby cards mounted for smoother horizontal scroll.
      getItemLayout={(_, index) => ({
        length: 340, // card width plus horizontal margins.
        offset: 340 * index,
        index,
      })}
    />
  );
};
