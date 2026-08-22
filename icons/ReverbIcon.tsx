import Svg, { Circle, Path } from "react-native-svg";

type ReverbIconProps = {
  color: string;
  size?: number;
};

export default function ReverbIcon({ color, size = 28 }: ReverbIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="12" r="1.6" fill={color} />
      <Path
        d="M9.5 7.2a6.8 6.8 0 0 1 0 9.6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M13.2 4.8a10.2 10.2 0 0 1 0 14.4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.65}
      />
      <Path
        d="M16.8 2.8a13.4 13.4 0 0 1 0 18.4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.35}
      />
    </Svg>
  );
}
