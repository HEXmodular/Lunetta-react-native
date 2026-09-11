import { useAudioEngine } from "@/audio/AudioEngineProvider";
import LfoWidget from "@/widgets/LfoWidget";
import OscillatorWidget, {
  semitonesToHz,
} from "@/widgets/OscillatorWidget";
import VolumeWidget from "@/widgets/VolumeWidget";
import { View } from "react-native";

export default function Index() {
  const audio = useAudioEngine();

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <View className="w-full gap-3">
        <View className="w-full flex-row items-start gap-3">
          <OscillatorWidget
            title="Oscillator 1"
            onChange={(semitones) => {
              audio.setOscFrequency(0, semitonesToHz(semitones));
            }}
          />
          <OscillatorWidget
            title="Oscillator 2"
            onChange={(semitones) => {
              audio.setOscFrequency(1, semitonesToHz(semitones));
            }}
          />
        </View>
        <View className="w-full flex-row items-start gap-3">
          <OscillatorWidget
            title="Oscillator 3"
            onChange={(semitones) => {
              audio.setOscFrequency(2, semitonesToHz(semitones));
            }}
          />
          <OscillatorWidget
            title="Oscillator 4"
            onChange={(semitones) => {
              audio.setOscFrequency(3, semitonesToHz(semitones));
            }}
          />
        </View>
        <View className="w-full flex-row items-start gap-3">
          <LfoWidget
            onChange={(hz) => {
              audio.setLfoRate(hz);
            }}
          />
          <VolumeWidget
            onChange={(percent) => {
              audio.setOscVolume(percent);
            }}
          />
        </View>
      </View>
    </View>
  );
}
