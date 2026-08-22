import PhaseInvertToggle from "@/components/PhaseInvertToggle";
import DelayWidget from "@/widgets/DelayWidget";
import GainWidget from "@/widgets/GainWidget";
import OscillatorWidget from "@/widgets/OscillatorWidget";
import ResonanceWidget from "@/widgets/ResonanceWidget";
import { View } from "react-native";

export default function ReverbWidget() {
  return (
    <View className="relative w-full">
      <View className="w-full gap-3">
        <View className="w-full flex-row items-start gap-3">
          <GainWidget />
          <OscillatorWidget title="Frequency" showValueSelector={false} />
        </View>
        <View className="w-full flex-row items-start gap-3">
          <ResonanceWidget />
          <DelayWidget />
        </View>
      </View>
      <View
        className="absolute inset-0 items-center justify-center"
        pointerEvents="box-none"
      >
        <PhaseInvertToggle />
      </View>
    </View>
  );
}
