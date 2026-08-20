import CircularSlider from "@/components/CircularSlider";
import ValueSelector from "@/components/ValueSelector";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const A4_HZ = 440;
const OFFSET_VALUES = [-36, -24, -12, 0, 12, 24, 36] as const;
const OFFSET_VALUES_SMALL = [3, 2, 1, 0, 1, 2, 3] as const;
const SLIDER_MIN = -36;
const SLIDER_MAX = 36;

export function semitonesToHz(semitones: number) {
  return A4_HZ * 2 ** (semitones / 12);
}

function formatSemitones(semitones: number) {
  const rounded = Math.round(semitones * 100) / 100;
  if (rounded > 0) {
    return `+${rounded}`;
  }

  return String(rounded);
}

type OscillatorWidgetProps = {
  onChange?: (semitones: number) => void;
  showValueSelector?: boolean;
};

export default function OscillatorWidget({
  onChange,
  showValueSelector = true,
}: OscillatorWidgetProps) {
  const [tune, setTune] = useState(0);
  const [offsetIndex, setOffsetIndex] = useState(
    OFFSET_VALUES_SMALL.indexOf(0),
  );
  const [offsetVisible, setOffsetVisible] = useState(true);
  const offset = OFFSET_VALUES_SMALL[offsetIndex] ?? 0;

  const emit = (nextTune: number, nextOffset: number) => {
    onChange?.(nextTune + nextOffset);
  };

  const semitones = tune + offset;
  const hz = semitonesToHz(semitones);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">
        Oscillator
      </Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={tune}
        onChange={(nextTune) => {
          setTune(nextTune);
          emit(nextTune, offset);
        }}
        formatValue={() => String(Math.round(hz))}
      />
      {showValueSelector ? (
        <>
          <Pressable
            onPress={() => setOffsetVisible((visible) => !visible)}
            className="mt-2 flex-row items-center gap-1 py-2"
          >
            <Text className="font-sans-medium text-sm text-primary/50">
              Octave
            </Text>
            {offset !== 0 ? (
              <Text className="font-sans-medium text-sm text-accent">
                {formatSemitones(offset)}
              </Text>
            ) : null}
            <Ionicons
              name={offsetVisible ? "chevron-up" : "chevron-down"}
              size={16}
              color="#08112666"
            />
          </Pressable>
          {offsetVisible ? (
            <View className="w-full">
              <ValueSelector
                values={OFFSET_VALUES_SMALL}
                selectedIndex={offsetIndex}
                onChange={(nextOffset, index) => {
                  setOffsetIndex(index);
                  emit(tune, nextOffset);
                }}
              />
            </View>
          ) : null}
        </>
      ) : null}
      <Text className="mt-2 font-sans-medium text-xs text-primary/40">
        {formatSemitones(semitones)} st from 440 Hz
      </Text>
    </View>
  );
}
