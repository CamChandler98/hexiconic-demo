import Svg, { Path } from "react-native-svg";

type RerollIconProps = {
  size?: number;
  color?: string;
};

export const RerollIcon = ({ size = 24, color = "#444" }: RerollIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.2A8 8 0 1 0 18.2 17"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 6v5h-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
