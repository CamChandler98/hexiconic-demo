import Svg, { G, Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const GemIconFacet = ({
  size = 31,
  color = "#444",
  strokeWidth = 1.5,
}: IconProps) => {
  return (
   <Svg
      width={size}
      height={size}
      viewBox="4.2075 4.2104 15.268 19.002"
      fill="none"
    >
      {/* Core gem group (scaled + translated) */}
      <G
        transform="matrix(0.814136 0 0 0.814136 3.95873 0.0907)"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        fill="none"
      >
        {/* Bottom crystal */}
        <Path d="M9.809 21.391L11.942 21.138C12.032 21.19 12.048 21.606 12.048 21.714L12.074 23.814C12.074 23.921 12.028 24 11.938 24.053L9.932 25.229C9.843 25.283 9.75 25.283 9.658 25.229L7.653 24.053C7.564 24 7.517 23.921 7.517 23.814L7.517 21.462C7.517 21.356 7.564 21.274 7.653 21.222L9.809 21.391Z" />

        {/* Main gem body */}
        <Path d="M16.438 13.583C16.579 13.815 16.579 14.041 16.438 14.273L12.063 20.323C11.924 20.552 11.712 20.667 11.434 20.667H8.207C7.928 20.667 7.718 20.552 7.579 20.323L2.926 14.273C2.786 14.041 2.786 13.815 2.926 13.583L5.987 8.536C6.128 8.304 6.337 8.191 6.614 8.191H12.748C13.025 8.191 13.375 8.536 13.375 8.536L16.438 13.583Z" />

        {/* Inner diamond */}
        <Path d="M9.792 11.143C9.819 11.106 9.846 11.106 9.873 11.143L12.447 14.75C12.474 14.787 12.474 14.824 12.447 14.861L9.873 18.468C9.846 18.505 9.819 18.505 9.792 18.468L7.218 14.861C7.191 14.824 7.191 14.787 7.218 14.75Z" />
      </G>

      {/* Illumination / sparkle lines */}
      {/* <Line x1="7.237" y1="7.319" x2="6.092" y2="6.271" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="11.87" y1="6.234" x2="11.88" y2="4.931" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="16.457" y1="7.185" x2="17.493" y2="5.787" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="6.1" y1="10.02" x2="4.496" y2="9.236" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Line x1="17.459" y1="10.29" x2="19.125" y2="9.496" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /> */}
    </Svg>
  );
};
