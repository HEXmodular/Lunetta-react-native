import CircularSlider from "@/components/CircularSlider";
import { useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const DEFAULT_MIX = 50;

export default function DryWetWidget() {
  const [mix, setMix] = useState(DEFAULT_MIX);

  return (
    <View className="w-full items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">
        Dry/Wet
      </Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={mix}
        onChange={setMix}
        label="Mix"
        unit="%"
        formatValue={(value) => String(Math.round(value))}
      />
    </View>
  );
}
