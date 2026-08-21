import { createOscillatorHtml } from "@/audio/oscillatorHtml";
import "@/global.css";
import LfoWidget from "@/widgets/LfoWidget";
import OscillatorWidget, {
  semitonesToHz,
} from "@/widgets/OscillatorWidget";
import { useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const DEFAULT_FREQ = 440;
const DEFAULT_LFO_RATE = 1;
const OSCILLATOR_HTML = createOscillatorHtml(DEFAULT_FREQ, DEFAULT_LFO_RATE);

function injectFrequency(webView: WebView | null, index: number, hz: number) {
  webView?.injectJavaScript(`window.setFrequency(${index}, ${hz}); true;`);
}

function injectLfoRate(webView: WebView | null, hz: number) {
  webView?.injectJavaScript(`window.setLfoRate(${hz}); true;`);
}

export default function Index() {
  const webViewRef = useRef<WebView>(null);
  const frequency0Ref = useRef(DEFAULT_FREQ);
  const frequency1Ref = useRef(DEFAULT_FREQ);
  const frequency2Ref = useRef(DEFAULT_FREQ);
  const frequency3Ref = useRef(DEFAULT_FREQ);
  const lfoRateRef = useRef(DEFAULT_LFO_RATE);

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
            injectFrequency(webViewRef.current, 2, frequency2Ref.current);
            injectFrequency(webViewRef.current, 3, frequency3Ref.current);
            injectLfoRate(webViewRef.current, lfoRateRef.current);
          }}
        />
      </View>
      <View className="w-full gap-3">
        <View className="w-full flex-row items-start gap-3">
          <OscillatorWidget
            title="Oscillator 1"
            onChange={(semitones) => {
              const hz = semitonesToHz(semitones);
              frequency0Ref.current = hz;
              injectFrequency(webViewRef.current, 0, hz);
            }}
          />
          <OscillatorWidget
            title="Oscillator 2"
            onChange={(semitones) => {
              const hz = semitonesToHz(semitones);
              frequency1Ref.current = hz;
              injectFrequency(webViewRef.current, 1, hz);
            }}
          />
        </View>
        <View className="w-full flex-row items-start gap-3">
          <OscillatorWidget
            title="Oscillator 3"
            onChange={(semitones) => {
              const hz = semitonesToHz(semitones);
              frequency2Ref.current = hz;
              injectFrequency(webViewRef.current, 2, hz);
            }}
          />
          <OscillatorWidget
            title="Oscillator 4"
            onChange={(semitones) => {
              const hz = semitonesToHz(semitones);
              frequency3Ref.current = hz;
              injectFrequency(webViewRef.current, 3, hz);
            }}
          />
        </View>
        <View className="w-1/2 self-center">
          <LfoWidget
            onChange={(hz) => {
              lfoRateRef.current = hz;
              injectLfoRate(webViewRef.current, hz);
            }}
          />
        </View>
      </View>
    </View>
  );
}
