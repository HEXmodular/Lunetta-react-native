import Keyboard from "@/components/keyboard/Keyboard";
import KeyboardOpenButton from "@/components/keyboard/KeyboardOpenButton";
import {
  midiToSemitones,
  semitonesToMidi,
} from "@/components/keyboard/notes";
import { useSynthSettings } from "@/synth/SynthSettingsProvider";
import LfoWidget from "@/widgets/LfoWidget";
import OscillatorWidget from "@/widgets/OscillatorWidget";
import VolumeWidget from "@/widgets/VolumeWidget";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const OSC_KEYS = ["osc1", "osc2", "osc3", "osc4"] as const;

export default function Index() {
  const { values, setParam } = useSynthSettings();
  const [keyboardExpanded, setKeyboardExpanded] = useState(false);

  const voiceMidis = OSC_KEYS.map((key) => semitonesToMidi(values[key]));

  if (keyboardExpanded) {
    return (
      <View className="flex-1 bg-background px-2 pb-2 pt-2">
        <Keyboard
          expanded
          rowCount={values.keyboardRows}
          onExpandedChange={setKeyboardExpanded}
          voiceMidis={voiceMidis}
          onVoiceMidiChange={(voiceIndex, midi) => {
            const key = OSC_KEYS[voiceIndex];
            if (!key) {
              return;
            }
            setParam(key, midiToSemitones(midi));
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow items-center justify-center px-4 py-4"
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full gap-3">
        <View className="relative w-full">
          <View className="w-full gap-3">
            <View className="w-full flex-row items-start gap-3">
              <OscillatorWidget
                title="Oscillator 1"
                value={values.osc1}
                onChange={(semitones) => setParam("osc1", semitones)}
              />
              <OscillatorWidget
                title="Oscillator 2"
                value={values.osc2}
                onChange={(semitones) => setParam("osc2", semitones)}
              />
            </View>
            <View className="w-full flex-row items-start gap-3">
              <OscillatorWidget
                title="Oscillator 3"
                value={values.osc3}
                onChange={(semitones) => setParam("osc3", semitones)}
              />
              <OscillatorWidget
                title="Oscillator 4"
                value={values.osc4}
                onChange={(semitones) => setParam("osc4", semitones)}
              />
            </View>
          </View>
          <View
            className="absolute inset-0 items-center justify-center"
            pointerEvents="box-none"
          >
            <KeyboardOpenButton onPress={() => setKeyboardExpanded(true)} />
          </View>
        </View>
        <View className="w-full flex-row items-start gap-3">
          <LfoWidget
            value={values.lfoRate}
            onChange={(hz) => setParam("lfoRate", hz)}
          />
          <VolumeWidget
            value={values.oscVolume}
            onChange={(percent) => setParam("oscVolume", percent)}
          />
        </View>
      </View>
    </ScrollView>
  );
}
