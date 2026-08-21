import "@/global.css";
import OscillatorWidget, {
  semitonesToHz,
} from "@/widgets/OscillatorWidget";
import { useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const DEFAULT_FREQ = 440;

const OSCILLATOR_HTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <script>
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const oscillators = [osc1, osc2];
      const outputGain = audioCtx.createGain();

      function xor(a, b) {
        return ((a >= 0 ? 1 : 0) ^ (b >= 0 ? 1 : 0)) ? 1 : -1;
      }

      osc1.type = "square";
      osc2.type = "square";
      osc1.frequency.value = ${DEFAULT_FREQ};
      osc2.frequency.value = ${DEFAULT_FREQ};
      outputGain.gain.value = 0.2;
      outputGain.connect(audioCtx.destination);

      window.setFrequency = function (index, hz) {
        oscillators[index].frequency.setValueAtTime(hz, audioCtx.currentTime);
        audioCtx.resume();
      };

      function startOscillators() {
        osc1.start();
        osc2.start();
        audioCtx.resume();
      }

      function connectScriptProcessorXor() {
        const merger = audioCtx.createChannelMerger(2);
        const xorNode = audioCtx.createScriptProcessor(1024, 2, 1);
        xorNode.channelCount = 2;
        xorNode.channelCountMode = "explicit";
        xorNode.channelInterpretation = "discrete";
        osc1.connect(merger, 0, 0);
        osc2.connect(merger, 0, 1);
        merger.connect(xorNode);
        xorNode.connect(outputGain);
        xorNode.onaudioprocess = function (event) {
          const input = event.inputBuffer;
          const a = input.getChannelData(0);
          const b =
            input.numberOfChannels > 1 ? input.getChannelData(1) : a;
          const out = event.outputBuffer.getChannelData(0);
          for (let i = 0; i < out.length; i++) {
            out[i] = xor(a[i], b[i]);
          }
        };
        startOscillators();
      }

      const workletCode =
        "function xor(a, b) {" +
        "  return ((a >= 0 ? 1 : 0) ^ (b >= 0 ? 1 : 0)) ? 1 : -1;" +
        "}" +
        "class XorProcessor extends AudioWorkletProcessor {" +
        "  process(inputs, outputs) {" +
        "    var aIn = inputs[0] && inputs[0][0];" +
        "    var bIn = inputs[1] && inputs[1][0];" +
        "    var out = outputs[0] && outputs[0][0];" +
        "    if (!aIn || !bIn || !out) return true;" +
        "    for (var i = 0; i < out.length; i++) {" +
        "      out[i] = xor(aIn[i], bIn[i]);" +
        "    }" +
        "    return true;" +
        "  }" +
        "}" +
        "registerProcessor('xor-processor', XorProcessor);";

      if (audioCtx.audioWorklet) {
        const url =
          "data:application/javascript;charset=utf-8," +
          encodeURIComponent(workletCode);
        audioCtx.audioWorklet
          .addModule(url)
          .then(function () {
            const xorNode = new AudioWorkletNode(audioCtx, "xor-processor", {
              numberOfInputs: 2,
              numberOfOutputs: 1,
              outputChannelCount: [1],
            });
            osc1.connect(xorNode, 0, 0);
            osc2.connect(xorNode, 0, 1);
            xorNode.connect(outputGain);
            startOscillators();
          })
          .catch(function () {
            connectScriptProcessorXor();
          });
      } else {
        connectScriptProcessorXor();
      }
    </script>
  </body>
</html>`;

function injectFrequency(webView: WebView | null, index: number, hz: number) {
  webView?.injectJavaScript(`window.setFrequency(${index}, ${hz}); true;`);
}

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const frequency0Ref = useRef(DEFAULT_FREQ);
  const frequency1Ref = useRef(DEFAULT_FREQ);

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <View
        className="absolute h-px w-px overflow-hidden opacity-0"
        pointerEvents="none"
      >
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: OSCILLATOR_HTML }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          onLoadEnd={() => {
            injectFrequency(webViewRef.current, 0, frequency0Ref.current);
            injectFrequency(webViewRef.current, 1, frequency1Ref.current);
          }}
        />
      </View>
      <View className="w-full flex-row items-start gap-3">
        <OscillatorWidget
          onChange={(semitones) => {
            const hz = semitonesToHz(semitones);
            frequency0Ref.current = hz;
            injectFrequency(webViewRef.current, 0, hz);
          }}
        />
        <OscillatorWidget
          onChange={(semitones) => {
            const hz = semitonesToHz(semitones);
            frequency1Ref.current = hz;
            injectFrequency(webViewRef.current, 1, hz);
          }}
        />
      </View>
    </View>
  );
}
