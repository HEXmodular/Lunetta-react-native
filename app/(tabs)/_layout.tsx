import TabBarButton from "@/components/TabBarButton";
import OscillatorIcon from "@/icons/OscillatorIcon";
import ReverbIcon from "@/icons/ReverbIcon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";

export default function TabLayout() {
  const router = useRouter();

  return (
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
            <OscillatorIcon color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reverb-1"
        options={{
          title: "REVB",
          tabBarAccessibilityLabel: "REVB",
          tabBarIcon: ({ color, size }) => (
            <ReverbIcon color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reverb-2"
        options={{
          title: "REVB",
          tabBarAccessibilityLabel: "REVB",
          tabBarIcon: ({ color, size }) => (
            <ReverbIcon color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="open-settings"
        options={{
          title: "SET",
          tabBarAccessibilityLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={String(color)} />
          ),
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/settings");
          },
        }}
      />
    </Tabs>
  );
}
