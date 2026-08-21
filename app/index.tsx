import { createOscillatorHtml } from "@/audio/oscillatorHtml";
import "@/global.css";
import OscillatorWidget, {
  semitonesToHz,
} from "@/widgets/OscillatorWidget";
import { useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const DEFAULT_FREQ = 440;
const OSCILLATOR_HTML = createOscillatorHtml(DEFAULT_FREQ);

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
