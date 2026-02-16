import { SoundEffects } from "@/app/hooks/sounds/effects";
import { useSoundEffect } from "@/app/hooks/sounds/effects/useSoundEffect";
import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { useSpinOnTrigger } from "@/app/hooks/animation/useSpinOnTrigger";
import { BasicTileGraphic, TierGraphics, TierKey } from "@/constants/Constants";
type LetterTileProps = {
  letter: string;
  onPress: () => void;
  tier: string;
  isCenter: boolean;
  nonInteractive?: boolean;
  riseInStyle?: {
    transform: { translateY: Animated.Value }[];
    opacity: Animated.Value;
  };
};

const TILE_TOUCH_SIZE = 75;
const TILE_VISUAL_SIZE = 100;
const TILE_MARGIN_TOP = 10;
const TILE_VISUAL_OFFSET = (TILE_VISUAL_SIZE - TILE_TOUCH_SIZE) / 2;
const TILE_HIT_SLOP = { top: 5, bottom: 5, left: 0, right: 0 } as const;

// Animated wrappers allow native-driver transforms on TouchableOpacity/View.
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

// Shared tile box model used by interactive and non-interactive variants.
const TileBaseStyles = `
  width: ${TILE_TOUCH_SIZE}px;
  aspect-ratio: 1/1;
  margin-top: ${TILE_MARGIN_TOP}px;
  justify-content: center;
  align-items: center;
`;

const TileShadow = styled.View`
  border-radius: 18px;

  /* iOS */
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;

  /* Android */
  elevation: 6;
`;

// Styled containers for interactive and static tile rendering.
export const TouchableTileContainer = styled(AnimatedTouchableOpacity)`
  ${TileBaseStyles}
`;

export const ViewTileContainer = styled(AnimatedView)`
  ${TileBaseStyles}
`;

export const SvgWrapper = styled.View.attrs({
  pointerEvents: "none",
})`
  position: absolute;
  top: -${TILE_VISUAL_OFFSET}px;
  left: -${TILE_VISUAL_OFFSET}px;
  padding: 5%;
  width: ${TILE_VISUAL_SIZE}px;
  height: ${TILE_VISUAL_SIZE}px;
`;

export const Letter = styled.Text`
  font-size: 35px;
  font-weight: bold;
  text-align: center;
`;

export const LetterTile = ({
  letter,
  tier,
  isCenter,
  onPress,
  nonInteractive,
  riseInStyle,
}: LetterTileProps) => {
  const TileGraphic = isCenter
    ? TierGraphics[tier as TierKey] || TierGraphics["Tier0"]
    : BasicTileGraphic;

  const { animatedStyle } = useSpinOnTrigger({
    enabled: isCenter && !nonInteractive,
    trigger: tier, // Re-run spin when the tier changes.
    duration: 800,
  });

  const tapSound = useSoundEffect(
    isCenter ? SoundEffects.tap.center : SoundEffects.tap.normal,
    { volume: isCenter ? 0.4 : 0.5 },
  );

  const handlePress = () => {
    tapSound.play();
    onPress();
  };
  const styleToApply = isCenter ? animatedStyle : undefined;

  const TileContent = (
    <>
      <SvgWrapper>
        <TileGraphic
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        ></TileGraphic>
      </SvgWrapper>
      <Letter>{letter.toUpperCase()}</Letter>
    </>
  );

  if (nonInteractive) {
    return (
      <Animated.View style={riseInStyle}>
        <ViewTileContainer style={styleToApply}>{TileContent}</ViewTileContainer>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={riseInStyle}>
      <TouchableTileContainer
        onPress={handlePress}
        style={styleToApply}
        hitSlop={TILE_HIT_SLOP}
        pressRetentionOffset={TILE_HIT_SLOP}
      >
        {TileContent}
      </TouchableTileContainer>
    </Animated.View>
  );
};
