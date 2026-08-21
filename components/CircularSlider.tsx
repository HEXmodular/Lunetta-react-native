import { useCallback, useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";
import Svg, { Circle, Path } from "react-native-svg";

const DEFAULT_SIZE = 280;
const START_ANGLE = 135;
const SWEEP = 270;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polar(angleDeg: number, center: number, radius: number) {
  const rad = toRad(angleDeg);
  return {
    x: center + radius * Math.cos(rad),
    y: center + radius * Math.sin(rad),
  };
}

function describeArc(
  startDeg: number,
  endDeg: number,
  center: number,
  radius: number,
) {
  const start = polar(startDeg, center, radius);
  const end = polar(endDeg, center, radius);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function valueToProgress(value: number, min: number, max: number) {
  if (max === min) {
    return 0;
  }

  return (value - min) / (max - min);
}

function angleToValue(angleRad: number, min: number, max: number) {
  let deg = (angleRad * 180) / Math.PI;
  if (deg < 0) deg += 360;

  let relative = deg - START_ANGLE;
  if (relative < 0) relative += 360;

  if (relative > SWEEP) {
    relative = relative > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP;
  }

  const t = relative / SWEEP;
  return Math.round((min + t * (max - min)) * 100) / 100;
}

type CircularSliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onPress?: () => void;
  onLongPress?: () => void;
  label?: string;
  unit?: string;
  formatValue?: (value: number) => string;
  size?: number;
};

export default function CircularSlider({
  value,
  min,
  max,
  onChange,
  onPress,
  onLongPress,
  label = "Frequency",
  unit = "Hz",
  formatValue = (next) => String(Math.round(next)),
  size = DEFAULT_SIZE,
}: CircularSliderProps) {
  const center = size / 2;
  const stroke = Math.max(8, Math.round((size / DEFAULT_SIZE) * 14));
  const thumb = Math.max(8, Math.round((size / DEFAULT_SIZE) * 14));
  const radius = center - thumb - stroke / 2;
  const compact = size < 240;

  const onChangeRef = useRef(onChange);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const centerRef = useRef(center);
  onChangeRef.current = onChange;
  minRef.current = min;
  maxRef.current = max;
  centerRef.current = center;

  const updateFromTouch = useCallback((x: number, y: number) => {
    const next = angleToValue(
      Math.atan2(y - centerRef.current, x - centerRef.current),
      minRef.current,
      maxRef.current,
    );
    onChangeRef.current(next);
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin((event) => {
          runOnJS(updateFromTouch)(event.x, event.y);
        })
        .onChange((event) => {
          runOnJS(updateFromTouch)(event.x, event.y);
        }),
    [updateFromTouch],
  );

  const progress = valueToProgress(value, min, max);
  const endAngle = START_ANGLE + SWEEP * progress;
  const thumbPoint = polar(endAngle, center, radius);

  return (
    <View style={{ width: size, height: size }}>
      <GestureDetector gesture={gesture}>
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            <Path
              d={describeArc(START_ANGLE, START_ANGLE + SWEEP, center, radius)}
              stroke="#0811261a"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={describeArc(
                START_ANGLE,
                Math.max(endAngle, START_ANGLE + 0.01),
                center,
                radius,
              )}
              stroke="#ea7a53"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
            />
            <Circle
              cx={thumbPoint.x}
              cy={thumbPoint.y}
              r={thumb}
              fill="#ea7a53"
            />
          </Svg>
        </View>
      </GestureDetector>
      <View
        className="absolute inset-0 items-center justify-center"
        pointerEvents={onPress || onLongPress ? "box-none" : "none"}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={400}
          disabled={!onPress && !onLongPress}
          className="items-center"
        >
          {label ? (
            <Text
              className={`font-sans-medium text-primary/40 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {label}
            </Text>
          ) : null}
          <Text
            className={`font-sans-bold text-primary ${
              compact ? "text-xl" : "text-4xl"
            }`}
          >
            {formatValue(value)}
          </Text>
          {unit ? (
            <Text
              className={`font-sans-medium text-primary/40 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              {unit}
            </Text>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
