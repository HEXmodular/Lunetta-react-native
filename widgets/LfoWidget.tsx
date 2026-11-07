import CircularSlider from "@/components/CircularSlider";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0.1;
const SLIDER_MAX = 20;
const DEFAULT_RATE = 1;

type LfoWidgetProps = {
  value?: number;
  onChange?: (hz: number) => void;
};

export default function LfoWidget({ value, onChange }: LfoWidgetProps) {
  const [rate, setRate] = useState(value ?? DEFAULT_RATE);

  useEffect(() => {
    if (value == null) {
      return;
    }
    setRate(value);
  }, [value]);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">LFO</Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={rate}
        onChange={(nextRate) => {
          setRate(nextRate);
          onChange?.(nextRate);
        }}
        label="Rate"
        unit="Hz"
        formatValue={(next) =>
          next >= 10 ? String(Math.round(next)) : next.toFixed(2)
        }
      />
    </View>
  );
}
