import "@/global.css";
import CircularSlider from "@/components/CircularSlider";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const MIN_FREQ = 20;
const MAX_FREQ = 2000;
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
  const [frequency, setFrequency] = useState(DEFAULT_FREQ);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <WebView
        ref={webViewRef}
        className="absolute h-px w-px opacity-0"
        pointerEvents="none"
        originWhitelist={["*"]}
        source={{ html: OSCILLATOR_HTML }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onLoadEnd={() => injectFrequency(webViewRef.current, frequency)}
      />
      <View className="flex-1 items-center justify-center px-6 mt-100">
        <CircularSlider
          min={MIN_FREQ}
          max={MAX_FREQ}
          value={frequency}
          onChange={(hz) => {
            setFrequency(hz);
            injectFrequency(webViewRef.current, hz);
          }}
        />
        <View className="mt-8 w-full max-w-[280px] flex-row justify-between">
          <Text className="text-sm text-slate-400">{MIN_FREQ} Hz</Text>
          <Text className="text-sm text-slate-400">{MAX_FREQ} Hz</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
