import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";

type KeyboardOpenButtonProps = {
  onPress: () => void;
};

export default function KeyboardOpenButton({ onPress }: KeyboardOpenButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open Keyboard"
      onPress={onPress}
      className="h-14 w-14 items-center justify-center rounded-full border border-border bg-background"
      style={({ pressed }) => ({
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <MaterialIcons name="piano" size={28} color="#f4f6fa" />
    </Pressable>
  );
}
