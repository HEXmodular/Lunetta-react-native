import CircularSlider from "@/components/CircularSlider";
import ValueSelector from "@/components/ValueSelector";
import { useState } from "react";
import { Text, View } from "react-native";

const A4_HZ = 440;
const A4_MIDI = 69;
const OFFSET_VALUES = [-36, -24, -12, 0, 12, 24, 36] as const;
const OFFSET_VALUES_SMALL = [3, 2, 1, 0, 1, 2, 3] as const;
const SLIDER_MIN = -36;
const SLIDER_MAX = 36;
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
const DISPLAY_CYCLE = ["st", "hz", "note"] as const;

type DisplayMode = (typeof DISPLAY_CYCLE)[number];

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

function semitonesToNoteName(semitones: number) {
  const midi = A4_MIDI + Math.round(semitones);
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;

  return `${name}${octave}`;
}

function nextDisplayMode(mode: DisplayMode): DisplayMode {
  return DISPLAY_CYCLE[(DISPLAY_CYCLE.indexOf(mode) + 1) % DISPLAY_CYCLE.length];
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
  const [displayMode, setDisplayMode] = useState<DisplayMode>("st");
  const offset = OFFSET_VALUES_SMALL[offsetIndex] ?? 0;

  const emit = (nextTune: number, nextOffset: number) => {
    onChange?.(nextTune + nextOffset);
  };

  const semitones = tune + offset;
  const hz = semitonesToHz(semitones);
  const display =
    displayMode === "hz"
      ? {
          label: "Frequency",
          unit: "Hz",
          value: String(Math.round(hz)),
          footer: `${formatSemitones(semitones)} st from 440 Hz`,
        }
      : displayMode === "note"
        ? {
            label: "Note",
            unit: "",
            value: semitonesToNoteName(semitones),
            footer: `${Math.round(hz)} Hz`,
          }
        : {
            label: "Tune",
            unit: "st",
            value: formatSemitones(semitones),
            footer: `${Math.round(hz)} Hz`,
          };

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
        onPress={() => setDisplayMode(nextDisplayMode)}
        onLongPress={
          displayMode === "st"
            ? () => {
                const nextTune = Math.round(tune);
                setTune(nextTune);
                emit(nextTune, offset);
              }
            : undefined
        }
        label={display.label}
        unit={display.unit}
        formatValue={() => display.value}
      />
      {showValueSelector ? (
        <>
          <Text className="font-sans-medium text-sm text-primary/50">
            Octave
          </Text>
          {offset !== 0 ? (
            <Text className="font-sans-medium text-sm text-accent">
              {formatSemitones(offset)}
            </Text>
          ) : null}
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
        </>
      ) : null}
      <Text className="mt-2 font-sans-medium text-xs text-primary/40">
        {display.footer}
      </Text>
    </View>
  );
}
