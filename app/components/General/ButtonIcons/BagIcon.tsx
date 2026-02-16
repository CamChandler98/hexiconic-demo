import React from "react";
import Svg, { G, Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const GemBagFacet = ({
  size = 31,
  color = "#444",
  strokeWidth = 1.5,
}: IconProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Top Ruffle / Flaps */}
        <Path d="M8 6C8 4 9 3 12 3C15 3 16 4 16 6" />
        <Path d="M7 7.5C6 6.5 6.5 5 8 5" />
        <Path d="M17 7.5C18 6.5 17.5 5 16 5" />

        {/* The Tie / Rope around the neck */}
        <Path d="M8 8.5C8 8.5 9 7.5 12 7.5C15 7.5 16 8.5 16 8.5" />
        
        {/* Main Bag Body */}
        <Path d="M16 8.5L19 12C20.5 14 20.5 17 18 19.5C16 21.5 14 22 12 22C10 22 8 21.5 6 19.5C3.5 17 3.5 14 5 12L8 8.5" />

        {/* --- THE DIAMOND FACET SYMBOL --- */}
        {/* Outer diamond shape */}
        <Path d="M12 11.5L15 14.5L12 18.5L9 14.5Z" />
        {/* Internal facet line for that "gem" look */}
        <Path d="M9 14.5H15" />
        
        {/* Subtle depth line on the bag to match the gem style */}
        <Path d="M8.5 10.5C8.5 10.5 10 12 12 12C14 12 15.5 10.5 15.5 10.5" />
      </G>
    </Svg>
  );
};