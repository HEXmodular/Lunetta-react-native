import PhaseInvertIcon from "@/icons/PhaseInvertIcon";
import { useState } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type PhaseInvertToggleProps = {
  onChange?: (inverted: boolean) => void;
};

export default function PhaseInvertToggle({ onChange }: PhaseInvertToggleProps) {
  const [inverted, setInverted] = useState(false);
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 300 },
      { rotateX: `${rotation.value}deg` },
    ],
  }));

  return (
    <Pressable
      onPress={() => {
        const next = !inverted;
        setInverted(next);
        rotation.value = withTiming(next ? 180 : 0, { duration: 280 });
        onChange?.(next);
      }}
      accessibilityRole="button"
      accessibilityLabel="Invert phase"
      accessibilityState={{ selected: inverted }}
      className={`h-14 w-14 items-center justify-center rounded-full border ${
        inverted ? "border-accent bg-accent" : "border-border bg-white"
      }`}
    >
      <Animated.View style={animatedStyle}>
        <PhaseInvertIcon color={inverted ? "#ffffff" : "#081126"} size={24} />
      </Animated.View>
    </Pressable>
  );
}
