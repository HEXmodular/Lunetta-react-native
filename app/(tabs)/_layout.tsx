import AudioEngineProvider from "@/audio/AudioEngineProvider";
import OscillatorIcon from "@/icons/OscillatorIcon";
import ReverbIcon from "@/icons/ReverbIcon";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <AudioEngineProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#ea7a53",
          tabBarInactiveTintColor: "#081126",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Oscillators",
            tabBarAccessibilityLabel: "Oscillators",
            tabBarIcon: ({ color, size }) => (
              <OscillatorIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="reverb-1"
          options={{
            title: "Reverb 1",
            tabBarAccessibilityLabel: "Reverb 1",
            tabBarIcon: ({ color, size }) => (
              <ReverbIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="reverb-2"
          options={{
            title: "Reverb 2",
            tabBarAccessibilityLabel: "Reverb 2",
            tabBarIcon: ({ color, size }) => (
              <ReverbIcon color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </AudioEngineProvider>
  );
}
