import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";

type FrequencyKeyboardButtonProps = {
  onPress: () => void;
};

export default function FrequencyKeyboardButton({
  onPress,
}: FrequencyKeyboardButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open Frequency Keyboard"
      hitSlop={8}
      onPress={onPress}
      className="h-5 w-5 items-center justify-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <MaterialIcons name="piano" size={16} color="#ea7a53" />
    </Pressable>
  );
}
