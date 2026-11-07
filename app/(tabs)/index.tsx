import { useAudioEngine } from "@/audio/AudioEngineProvider";
import Keyboard from "@/components/keyboard/Keyboard";
import KeyboardOpenButton from "@/components/keyboard/KeyboardOpenButton";
import {
  midiToSemitones,
  semitonesToMidi,
} from "@/components/keyboard/notes";
import LfoWidget from "@/widgets/LfoWidget";
import OscillatorWidget, {
  semitonesToHz,
} from "@/widgets/OscillatorWidget";
import VolumeWidget from "@/widgets/VolumeWidget";
import { useCallback, useState } from "react";
import { View } from "react-native";

const OSC_COUNT = 4;

export default function Index() {
  const audio = useAudioEngine();
  const [keyboardExpanded, setKeyboardExpanded] = useState(false);
  const [oscSemitones, setOscSemitones] = useState(() =>
    Array.from({ length: OSC_COUNT }, () => 0),
  );

  const setOsc = useCallback(
    (index: number, semitones: number) => {
      setOscSemitones((current) => {
        if (current[index] === semitones) {
          return current;
        }
        const next = current.slice();
        next[index] = semitones;
        return next;
      });
      audio.setOscFrequency(index, semitonesToHz(semitones));
    },
    [audio],
  );

  const voiceMidis = oscSemitones.map(semitonesToMidi);

  if (keyboardExpanded) {
    return (
      <View className="flex-1 bg-background px-2 pb-2 pt-2">
        <Keyboard
          expanded
          onExpandedChange={setKeyboardExpanded}
          voiceMidis={voiceMidis}
          onVoiceMidiChange={(voiceIndex, midi) => {
            setOsc(voiceIndex, midiToSemitones(midi));
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <View className="w-full gap-3">
        <View className="relative w-full">
          <View className="w-full gap-3">
            <View className="w-full flex-row items-start gap-3">
              <OscillatorWidget
                title="Oscillator 1"
                value={oscSemitones[0]}
                onChange={(semitones) => setOsc(0, semitones)}
              />
              <OscillatorWidget
                title="Oscillator 2"
                value={oscSemitones[1]}
                onChange={(semitones) => setOsc(1, semitones)}
              />
            </View>
            <View className="w-full flex-row items-start gap-3">
              <OscillatorWidget
                title="Oscillator 3"
                value={oscSemitones[2]}
                onChange={(semitones) => setOsc(2, semitones)}
              />
              <OscillatorWidget
                title="Oscillator 4"
                value={oscSemitones[3]}
                onChange={(semitones) => setOsc(3, semitones)}
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
            onChange={(hz) => {
              audio.setLfoRate(hz);
            }}
          />
          <VolumeWidget
            onChange={(percent) => {
              audio.setOscVolume(percent);
            }}
          />
        </View>
      </View>
    </View>
  );
}
