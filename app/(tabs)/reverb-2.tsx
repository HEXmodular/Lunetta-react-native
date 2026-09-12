import { useAudioEngine } from "@/audio/AudioEngineProvider";
import DryWetWidget from "@/widgets/DryWetWidget";
import ReverbWidget from "@/widgets/ReverbWidget";
import VolumeWidget from "@/widgets/VolumeWidget";
import { View } from "react-native";

export default function Reverb2Screen() {
  const audio = useAudioEngine();

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <View className="w-full gap-3">
        <ReverbWidget chainIndex={1} />
        <View className="w-full flex-row items-start gap-3">
          <DryWetWidget onChange={audio.setDryWet} />
          <VolumeWidget label="Master" onChange={audio.setMasterVolume} />
        </View>
      </View>
    </View>
  );
}
