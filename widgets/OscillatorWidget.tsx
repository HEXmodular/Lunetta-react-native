import CircularSlider from "@/components/CircularSlider";
import FrequencyKeyboardButton from "@/components/keyboard/FrequencyKeyboardButton";
import ValueSelector from "@/components/ValueSelector";
import { useEffect, useState } from "react";
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

function splitSemitones(semitones: number): {
  tune: number;
  offsetIndex: number;
} {
  let best = {
    tune: semitones,
    offsetIndex: OFFSET_OCTAVES.indexOf(0),
    distance: Number.POSITIVE_INFINITY,
  };

  for (let index = 0; index < OFFSET_OCTAVES.length; index += 1) {
    const octave = OFFSET_OCTAVES[index] ?? 0;
    const tune = semitones - octave * 12;
    if (tune < SLIDER_MIN || tune > SLIDER_MAX) {
      continue;
    }
    const distance = Math.abs(tune);
    if (distance < best.distance) {
      best = { tune, offsetIndex: index, distance };
    }
  }

  if (best.distance === Number.POSITIVE_INFINITY) {
    const clamped = Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, semitones));
    return { tune: clamped, offsetIndex: OFFSET_OCTAVES.indexOf(0) };
  }

  return { tune: best.tune, offsetIndex: best.offsetIndex };
}

type OscillatorWidgetProps = {
  title?: string;
  /** Total semitones from A4. When set, the widget stays in sync with external edits. */
  value?: number;
  onChange?: (semitones: number) => void;
  showValueSelector?: boolean;
  onKeyboardPress?: () => void;
};

export default function OscillatorWidget({
  title = "Oscillator",
  value,
  onChange,
  showValueSelector = true,
  onKeyboardPress,
}: OscillatorWidgetProps) {
  const [tune, setTune] = useState(() =>
    value == null ? 0 : splitSemitones(value).tune,
  );
  const [offsetIndex, setOffsetIndex] = useState(() =>
    value == null
      ? OFFSET_OCTAVES.indexOf(0)
      : splitSemitones(value).offsetIndex,
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>("st");
  const offset = (OFFSET_OCTAVES[offsetIndex] ?? 0) * 12;

  useEffect(() => {
    if (value == null) {
      return;
    }
    const current = tune + (OFFSET_OCTAVES[offsetIndex] ?? 0) * 12;
    if (Math.abs(current - value) < 0.0001) {
      return;
    }
    const next = splitSemitones(value);
    setTune(next.tune);
    setOffsetIndex(next.offsetIndex);
  }, [value, tune, offsetIndex]);

  const emit = (nextTune: number, nextOffset: number) => {
    onChange?.(nextTune + nextOffset);
  };

  const semitones = value ?? tune + offset;
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
      <View className="mb-1 flex-row items-center justify-center gap-1.5">
        <Text className="font-sans-semibold text-sm text-primary">{title}</Text>
        {onKeyboardPress ? (
          <FrequencyKeyboardButton onPress={onKeyboardPress} />
        ) : null}
      </View>
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
