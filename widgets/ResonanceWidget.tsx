import CircularSlider from "@/components/CircularSlider";
import { useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const DEFAULT_RESONANCE = 0;

export default function ResonanceWidget() {
  const [resonance, setResonance] = useState(DEFAULT_RESONANCE);

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
        onChange={setResonance}
        label="Resonance"
        unit="%"
        formatValue={(value) => String(Math.round(value))}
      />
    </View>
  );
}
