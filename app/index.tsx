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
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = ${DEFAULT_FREQ};
      gain.gain.value = 0.2;
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      audioCtx.resume();

      window.setFrequency = function (hz) {
        oscillator.frequency.setValueAtTime(hz, audioCtx.currentTime);
        audioCtx.resume();
      };
    </script>
  </body>
</html>`;

function injectFrequency(webView: WebView | null, hz: number) {
  webView?.injectJavaScript(`window.setFrequency(${hz}); true;`);
}

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const frequencyRef = useRef(DEFAULT_FREQ);

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
          onLoadEnd={() =>
            injectFrequency(webViewRef.current, frequencyRef.current)
          }
        />
      </View>
      <View className="w-full flex-row items-start gap-3">
        <OscillatorWidget />
        <OscillatorWidget
          onChange={(semitones) => {
            const hz = semitonesToHz(semitones);
            frequencyRef.current = hz;
            injectFrequency(webViewRef.current, hz);
          }}
        />
      </View>
    </View>
  );
}
