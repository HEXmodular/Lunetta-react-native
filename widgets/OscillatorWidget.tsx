import CircularSlider from "@/components/CircularSlider";
import ValueSelector from "@/components/ValueSelector";
import { useState } from "react";
import { Text, View } from "react-native";

const A4_HZ = 440;
const A4_MIDI = 69;
const OFFSET_OCTAVES = [-3, -2, -1, 0, 1, 2, 3] as const;
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
  title?: string;
  onChange?: (semitones: number) => void;
  showValueSelector?: boolean;
};

export default function OscillatorWidget({
  title = "Oscillator",
  onChange,
  showValueSelector = true,
}: OscillatorWidgetProps) {
  const [tune, setTune] = useState(0);
  const [offsetIndex, setOffsetIndex] = useState(OFFSET_OCTAVES.indexOf(0));
  const [displayMode, setDisplayMode] = useState<DisplayMode>("st");
  const offset = (OFFSET_OCTAVES[offsetIndex] ?? 0) * 12;

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
        }
      : displayMode === "note"
        ? {
            label: "Note",
            unit: "",
            value: semitonesToNoteName(semitones),
          }
        : {
            label: "Tune",
            unit: "st",
            value: formatSemitones(semitones),
          };

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">
        {title}
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
          <Text className="font-sans-medium text-xs text-primary/50">
            octave
          </Text>
          <View className="w-full">
            <ValueSelector
              values={OFFSET_OCTAVES}
              selectedIndex={offsetIndex}
              onChange={(nextOctave, index) => {
                setOffsetIndex(index);
                emit(tune, nextOctave * 12);
              }}
            />
          </View>
        </>
      ) : null}
    </View>
  );
}
