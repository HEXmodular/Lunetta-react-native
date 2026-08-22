import Svg, { Path } from "react-native-svg";

type PhaseInvertIconProps = {
  color: string;
  size?: number;
};

export default function PhaseInvertIcon({
  color,
  size = 28,
}: PhaseInvertIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12C4.2 12 5.2 5 8 5s3.8 14 6.5 14S18 12 22 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
