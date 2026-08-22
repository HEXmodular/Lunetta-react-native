import DryWetWidget from "@/widgets/DryWetWidget";
import ReverbWidget from "@/widgets/ReverbWidget";
import { View } from "react-native";

export default function Reverb2Screen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <View className="w-full gap-3">
        <ReverbWidget />
        <View className="w-1/2 self-center">
          <DryWetWidget />
        </View>
      </View>
    </View>
  );
}
