import { useAudioEngine } from "@/audio/AudioEngineProvider";
import PhaseInvertToggle from "@/components/PhaseInvertToggle";
import DelayWidget from "@/widgets/DelayWidget";
import GainWidget from "@/widgets/GainWidget";
import OscillatorWidget, { semitonesToHz } from "@/widgets/OscillatorWidget";
import ResonanceWidget from "@/widgets/ResonanceWidget";
import { View } from "react-native";

type ReverbWidgetProps = {
  chainIndex: number;
};

export default function ReverbWidget({ chainIndex }: ReverbWidgetProps) {
  const audio = useAudioEngine();

  return (
    <View className="relative w-full">
      <View className="w-full gap-3">
        <View className="w-full flex-row items-start gap-3">
          <GainWidget
            onChange={(db) => audio.setReverbGain(chainIndex, db)}
          />
          <OscillatorWidget
            title="Frequency"
            showValueSelector={false}
            onChange={(semitones) =>
              audio.setReverbFrequency(chainIndex, semitonesToHz(semitones))
            }
          />
        </View>
        <View className="w-full flex-row items-start gap-3">
          <ResonanceWidget
            onChange={(percent) =>
              audio.setReverbResonance(chainIndex, percent)
            }
          />
          <DelayWidget
            onChange={(ms) => audio.setReverbDelay(chainIndex, ms)}
          />
        </View>
      </View>
      <View
        className="absolute inset-0 items-center justify-center"
        pointerEvents="box-none"
      >
        <PhaseInvertToggle
          onChange={(inverted) => audio.setReverbPhase(chainIndex, inverted)}
        />
      </View>
    </View>
  );
}
