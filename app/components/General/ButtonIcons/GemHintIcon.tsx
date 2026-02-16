import Svg, { G, Path } from "react-native-svg";

type GemHintIconProps = {
  size?: number;
  strokeColor?: string;
  gemFill?: string;
  sparkleColor?: string;
};

export const GemHintIcon = ({
  size = 24,
  strokeColor = "#4E6DC4",
  gemFill = "#E8ECFF",
  sparkleColor = "#FFD86B",
}: GemHintIconProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Outer gem */}
      <Path
        d="M6 4H18L21 9L12 20L3 9L6 4Z"
        fill={gemFill}
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Inner facets */}
      <G opacity={0.6}>
        <Path
          d="M6 4L12 19.331L18 4"
          stroke={strokeColor}
          strokeWidth={1}
        />
        <Path
          d="M3 9H21"
          stroke={strokeColor}
          strokeWidth={1}
        />
      </G>

      {/* Sparkle */}
      <Path
        d="M18.041 1.253
           L18.845 3.664
           L21.257 4.468
           L18.845 5.272
           L18.041 7.684
           L17.237 5.272
           L14.826 4.468
           L17.237 3.664
           L18.041 1.253Z"
        fill={sparkleColor}
      />
    </Svg>
  );
};