import CircularSlider from "@/components/CircularSlider";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const DEFAULT_RESONANCE = 0;

type ResonanceWidgetProps = {
  value?: number;
  onChange?: (percent: number) => void;
};

export default function ResonanceWidget({
  value,
  onChange,
}: ResonanceWidgetProps) {
  const [resonance, setResonance] = useState(value ?? DEFAULT_RESONANCE);

  useEffect(() => {
    if (value == null) {
      return;
    }
    setResonance(value);
  }, [value]);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">
        Resonance
      </Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={resonance}
        onChange={(nextResonance) => {
          setResonance(nextResonance);
          onChange?.(nextResonance);
        }}
        label="Resonance"
        unit="%"
        formatValue={(next) => String(Math.round(next))}
      />
    </View>
  );
}
