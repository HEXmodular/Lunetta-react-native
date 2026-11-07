import CircularSlider from "@/components/CircularSlider";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const DEFAULT_MIX = 50;

type DryWetWidgetProps = {
  value?: number;
  onChange?: (percent: number) => void;
};

export default function DryWetWidget({ value, onChange }: DryWetWidgetProps) {
  const [mix, setMix] = useState(value ?? DEFAULT_MIX);

  useEffect(() => {
    if (value == null) {
      return;
    }
    setMix(value);
  }, [value]);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">
        Dry/Wet
      </Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={mix}
        onChange={(nextMix) => {
          setMix(nextMix);
          onChange?.(nextMix);
        }}
        label="Mix"
        unit="%"
        formatValue={(next) => String(Math.round(next))}
      />
    </View>
  );
}
