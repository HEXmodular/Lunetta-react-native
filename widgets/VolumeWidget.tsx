import CircularSlider from "@/components/CircularSlider";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100;
const DEFAULT_VOLUME = 100;

type VolumeWidgetProps = {
  label?: string;
  value?: number;
  onChange?: (percent: number) => void;
};

export default function VolumeWidget({
  label = "Volume",
  value,
  onChange,
}: VolumeWidgetProps) {
  const [volume, setVolume] = useState(value ?? DEFAULT_VOLUME);

  useEffect(() => {
    if (value == null) {
      return;
    }
    setVolume(value);
  }, [value]);

  return (
    <View className="min-w-0 flex-1 items-center rounded-2xl border border-border px-2 py-3">
      <Text className="mb-1 font-sans-semibold text-sm text-primary">
        {label}
      </Text>
      <CircularSlider
        size={140}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={volume}
        onChange={(nextVolume) => {
          setVolume(nextVolume);
          onChange?.(nextVolume);
        }}
        label={label}
        unit="%"
        formatValue={(next) => String(Math.round(next))}
      />
    </View>
  );
}
