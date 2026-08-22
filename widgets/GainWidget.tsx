import CircularSlider from "@/components/CircularSlider";
import { useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = -100;
const SLIDER_MAX = 24;
const DEFAULT_GAIN = 0;

function formatDb(value: number) {
  const rounded = Math.round(value * 10) / 10;
  if (rounded > 0) {
    return `+${rounded}`;
  }

  return String(rounded);
}

type GainWidgetProps = {
  onChange?: (db: number) => void;
};

export default function GainWidget({ onChange }: GainWidgetProps) {
  const [gain, setGain] = useState(DEFAULT_GAIN);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">Gain</Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={gain}
        onChange={(nextGain) => {
          setGain(nextGain);
          onChange?.(nextGain);
        }}
        label="Gain"
        unit="dB"
        formatValue={formatDb}
      />
    </View>
  );
}
