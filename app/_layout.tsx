import "@/global.css";
import AudioEngineProvider from "@/audio/AudioEngineProvider";
import SynthSettingsProvider from "@/synth/SynthSettingsProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-background" style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AudioEngineProvider>
        <SynthSettingsProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#081126" },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings" />
          </Stack>
        </SynthSettingsProvider>
      </AudioEngineProvider>
    </GestureHandlerRootView>
  );
}
