import { useCallback, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const SIZE = 280;
const CENTER = SIZE / 2;
const STROKE = 14;
const THUMB = 14;
const RADIUS = CENTER - THUMB - STROKE / 2;
const START_ANGLE = 135;
const SWEEP = 270;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polar(angleDeg: number) {
  const rad = toRad(angleDeg);
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

function describeArc(startDeg: number, endDeg: number) {
  const start = polar(startDeg);
  const end = polar(endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
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
  label?: string;
  unit?: string;
  formatValue?: (value: number) => string;
};

export default function CircularSlider({
  value,
  min,
  max,
  onChange,
  label = "Frequency",
  unit = "Hz",
  formatValue = (next) => String(Math.round(next)),
}: CircularSliderProps) {
  const onChangeRef = useRef(onChange);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  onChangeRef.current = onChange;
  minRef.current = min;
  maxRef.current = max;

  const updateFromTouch = useCallback((x: number, y: number) => {
    const next = angleToValue(
      Math.atan2(y - CENTER, x - CENTER),
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
  const thumb = polar(endAngle);

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Path
            d={describeArc(START_ANGLE, START_ANGLE + SWEEP)}
            stroke="#0811261a"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={describeArc(START_ANGLE, Math.max(endAngle, START_ANGLE + 0.01))}
            stroke="#ea7a53"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />
          <Circle cx={thumb.x} cy={thumb.y} r={THUMB} fill="#ea7a53" />
        </Svg>
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <Text className="font-sans-medium text-sm text-primary/40">
            {label}
          </Text>
          <Text className="font-sans-bold text-4xl text-primary">
            {formatValue(value)}
          </Text>
          <Text className="font-sans-medium text-sm text-primary/40">
            {unit}
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
}
