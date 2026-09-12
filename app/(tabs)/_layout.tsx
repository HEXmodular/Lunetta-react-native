import AudioEngineProvider from "@/audio/AudioEngineProvider";
import TabBarButton from "@/components/TabBarButton";
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
          tabBarInactiveTintColor: "rgba(244, 246, 250, 0.45)",
          tabBarButton: TabBarButton,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: "#081126",
            borderTopColor: "rgba(255, 255, 255, 0.12)",
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
