import Svg, { Path } from "react-native-svg";

export const DeleteIcon = ({ size = 24, color = "#444" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12l6-6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-6-6z"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 9l4 4m0-4l-4 4"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};