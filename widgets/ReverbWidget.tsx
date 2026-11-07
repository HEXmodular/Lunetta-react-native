import Keyboard from "@/components/keyboard/Keyboard";
import {
  midiToSemitones,
  semitonesToMidi,
} from "@/components/keyboard/notes";
import PhaseInvertToggle from "@/components/PhaseInvertToggle";
import { useSynthSettings } from "@/synth/SynthSettingsProvider";
import DelayWidget from "@/widgets/DelayWidget";
import GainWidget from "@/widgets/GainWidget";
import OscillatorWidget from "@/widgets/OscillatorWidget";
import ResonanceWidget from "@/widgets/ResonanceWidget";
import { useState } from "react";
import { Modal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type ReverbWidgetProps = {
  chainIndex: number;
};

export default function ReverbWidget({ chainIndex }: ReverbWidgetProps) {
  const { values, setParam } = useSynthSettings();
  const [keyboardExpanded, setKeyboardExpanded] = useState(false);

  const isFirst = chainIndex === 0;
  const gain = isFirst ? values.reverb1Gain : values.reverb2Gain;
  const freq = isFirst ? values.reverb1Freq : values.reverb2Freq;
  const resonance = isFirst
    ? values.reverb1Resonance
    : values.reverb2Resonance;
  const delay = isFirst ? values.reverb1Delay : values.reverb2Delay;
  const phaseInvert = isFirst
    ? values.reverb1PhaseInvert
    : values.reverb2PhaseInvert;

  return (
    <>
      <View className="relative w-full">
        <View className="w-full gap-3">
          <View className="w-full flex-row items-start gap-3">
            <GainWidget
              value={gain}
              onChange={(db) =>
                setParam(isFirst ? "reverb1Gain" : "reverb2Gain", db)
              }
            />
            <OscillatorWidget
              title="Frequency"
              value={freq}
              showValueSelector={false}
              onKeyboardPress={() => setKeyboardExpanded(true)}
              onChange={(semitones) =>
                setParam(isFirst ? "reverb1Freq" : "reverb2Freq", semitones)
              }
            />
          </View>
          <View className="w-full flex-row items-start gap-3">
            <ResonanceWidget
              value={resonance}
              onChange={(percent) =>
                setParam(
                  isFirst ? "reverb1Resonance" : "reverb2Resonance",
                  percent,
                )
              }
            />
            <DelayWidget
              value={delay}
              onChange={(ms) =>
                setParam(isFirst ? "reverb1Delay" : "reverb2Delay", ms)
              }
            />
          </View>
        </View>
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="box-none"
        >
          <PhaseInvertToggle
            value={phaseInvert}
            onChange={(inverted) =>
              setParam(
                isFirst ? "reverb1PhaseInvert" : "reverb2PhaseInvert",
                inverted,
              )
            }
          />
        </View>
      </View>

      <Modal
        visible={keyboardExpanded}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => setKeyboardExpanded(false)}
      >
        <GestureHandlerRootView style={{ flex: 1 }} className="flex-1 bg-background">
          <View className="flex-1 bg-background px-2 pb-2 pt-2">
            <Keyboard
              expanded
              mode="hold"
              rowCount={values.keyboardRows}
              onExpandedChange={setKeyboardExpanded}
              voiceMidis={[semitonesToMidi(freq)]}
              onVoiceMidiChange={(_voiceIndex, midi) => {
                setParam(
                  isFirst ? "reverb1Freq" : "reverb2Freq",
                  midiToSemitones(midi),
                );
              }}
            />
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}
