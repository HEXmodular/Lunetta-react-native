import CircularSlider from "@/components/CircularSlider";
import { useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0;
const SLIDER_MAX = 10000;
const DEFAULT_DELAY_MS = 0;

function formatDelay(ms: number) {
  if (ms < 1000) {
    return String(Math.round(ms));
  }

  const seconds = Math.round((ms / 1000) * 100) / 100;
  return Number.isInteger(seconds) ? String(seconds) : seconds.toFixed(2);
}

type DelayWidgetProps = {
  onChange?: (ms: number) => void;
};

export default function DelayWidget({ onChange }: DelayWidgetProps) {
  const [delayMs, setDelayMs] = useState(DEFAULT_DELAY_MS);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">Delay</Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={delayMs}
        onChange={(nextDelayMs) => {
          setDelayMs(nextDelayMs);
          onChange?.(nextDelayMs);
        }}
        label="Time"
        unit={delayMs < 1000 ? "ms" : "s"}
        formatValue={formatDelay}
      />
    </View>
  );
}
