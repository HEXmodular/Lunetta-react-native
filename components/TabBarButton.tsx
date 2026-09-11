import type { BottomTabBarButtonProps } from "expo-router/js-tabs";
import { PlatformPressable } from "expo-router/react-navigation";

export default function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      android_ripple={{ color: "transparent" }}
      pressColor="transparent"
      pressOpacity={1}
    />
  );
}
