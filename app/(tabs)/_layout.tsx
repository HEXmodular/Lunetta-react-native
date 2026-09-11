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
          tabBarActiveTintColor: "#ea7a53",
          tabBarInactiveTintColor: "#081126",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "OSC",
            tabBarAccessibilityLabel: "OSC",
            tabBarIcon: ({ color, size }) => (
              <OscillatorIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="reverb-1"
          options={{
            title: "REVB",
            tabBarAccessibilityLabel: "REVB",
            tabBarIcon: ({ color, size }) => (
              <ReverbIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="reverb-2"
          options={{
            title: "REVB",
            tabBarAccessibilityLabel: "REVB",
            tabBarIcon: ({ color, size }) => (
              <ReverbIcon color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </AudioEngineProvider>
  );
}
