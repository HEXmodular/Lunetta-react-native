import { useSynthSettings } from "@/synth/SynthSettingsProvider";
import DryWetWidget from "@/widgets/DryWetWidget";
import ReverbWidget from "@/widgets/ReverbWidget";
import VolumeWidget from "@/widgets/VolumeWidget";
import { ScrollView, View } from "react-native";

export default function Reverb2Screen() {
  const { values, setParam } = useSynthSettings();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow items-center justify-center px-4 py-4"
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full gap-3">
        <ReverbWidget chainIndex={1} />
        <View className="w-full flex-row items-start gap-3">
          <DryWetWidget
            value={values.dryWet}
            onChange={(percent) => setParam("dryWet", percent)}
          />
          <VolumeWidget
            label="Master"
            value={values.masterVolume}
            onChange={(percent) => setParam("masterVolume", percent)}
          />
        </View>
      </View>
    </ScrollView>
  );
}
