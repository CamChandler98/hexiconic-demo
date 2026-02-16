import Svg, { G, Path } from "react-native-svg";

type GemEyeIconProps = {
  size?: number;
  strokeColor?: string;
  eyeFill?: string;
  plusFill?: string;
  sparkleColor?: string;
};

export const GemEyeIcon = ({
  size = 24,
  strokeColor = "#4E6DC4",
  eyeFill = "#E8ECFF",
  plusFill = "#E5F9FF",
  sparkleColor = "#FFD86B",
}: GemEyeIconProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Eye outline */}
      <Path
        d="
          M2 12
          C4.6 6.7 8.7 4.5 12 4.5
          C15.3 4.5 19.4 6.7 22 12
          C19.4 17.3 15.3 19.5 12 19.5
          C8.7 19.5 4.6 17.3 2 12
          Z
        "
        fill={eyeFill}
        stroke={strokeColor}
        strokeWidth={1.25}
      />

      {/* Sparkles */}
      <Path
        d="M6.3 3.7L6.8 5.1L8.2 5.6L6.8 6.1L6.3 7.5L5.8 6.1L4.4 5.6L5.8 5.1Z"
        fill={sparkleColor}
      />
      <Path
        d="M9.2 15.8L9.6 17L10.9 17.4L9.6 17.8L9.2 19L8.8 17.8L7.5 17.4L8.8 17Z"
        fill={sparkleColor}
      />
      <Path
        d="M17.8 4.2L18.4 5.9L20.1 6.5L18.4 7.1L17.8 8.8L17.2 7.1L15.5 6.5L17.2 5.9Z"
        fill={sparkleColor}
      />

      {/* Plus */}
      <Path
        d="
          M10.6 7.5
          H13.4
          V10
          H16
          V14
          H13.4
          V16.5
          H10.6
          V14
          H8
          V10
          H10.6
          Z
        "
        fill={plusFill}
        fillOpacity={0.35}
        stroke={strokeColor}
        strokeWidth={1.25}
        strokeLinejoin="round"
      />

      {/* Plus connector accents */}
      <G opacity={0.6}>
        <Path d="M8 10.2L5.2 9.3" stroke={strokeColor} strokeWidth={1} />
        <Path d="M16 10.2L18.8 9.1" stroke={strokeColor} strokeWidth={1} />
        <Path d="M8 14.8L5.9 16.4" stroke={strokeColor} strokeWidth={1} />
        <Path d="M16 14.8L18.2 16.3" stroke={strokeColor} strokeWidth={1} />
      </G>
    </Svg>
  );
};
