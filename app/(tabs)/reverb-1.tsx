import ReverbWidget from "@/widgets/ReverbWidget";
import { View } from "react-native";

export default function Reverb1Screen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <ReverbWidget chainIndex={0} />
    </View>
  );
}
