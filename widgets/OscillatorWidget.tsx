import CircularSlider from "@/components/CircularSlider";
import ValueSelector from "@/components/ValueSelector";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const A4_HZ = 440;
const OFFSET_VALUES = [-36, -24, -12, 0, 12, 24, 36] as const;
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
};

export default function OscillatorWidget({ onChange }: OscillatorWidgetProps) {
  const [tune, setTune] = useState(0);
  const [offset, setOffset] = useState(0);
  const [offsetVisible, setOffsetVisible] = useState(true);

  const emit = (nextTune: number, nextOffset: number) => {
    onChange?.(nextTune + nextOffset);
  };

  const semitones = tune + offset;
  const hz = semitonesToHz(semitones);

  return (
    <View className="w-full items-center rounded-2xl border border-border px-3 py-4">
      <Text className="mb-2 font-sans-semibold text-base text-primary">
        Oscillator
      </Text>
      <CircularSlider
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={tune}
        onChange={(nextTune) => {
          setTune(nextTune);
          emit(nextTune, offset);
        }}
        formatValue={() => String(Math.round(hz))}
      />
      <Pressable
        onPress={() => setOffsetVisible((visible) => !visible)}
        className="mt-2 flex-row items-center gap-1 py-2"
      >
        <Text className="font-sans-medium text-sm text-primary/50">Octave</Text>
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
            values={OFFSET_VALUES}
            value={offset}
            onChange={(nextOffset) => {
              setOffset(nextOffset);
              emit(tune, nextOffset);
            }}
          />
        </View>
      ) : null}
      <Text className="mt-2 font-sans-medium text-xs text-primary/40">
        {formatSemitones(semitones)} st from 440 Hz
      </Text>
    </View>
  );
}
