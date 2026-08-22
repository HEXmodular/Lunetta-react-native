import { createEngineHtml } from "@/audio/engineHtml";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const DEFAULT_FREQ = 440;
const DEFAULT_LFO_RATE = 1;
const DEFAULT_GAIN_DB = 0;
const DEFAULT_RESONANCE = 0;
const DEFAULT_DELAY_MS = 0;
const DEFAULT_DRY_WET = 50;
const ENGINE_HTML = createEngineHtml(DEFAULT_FREQ, DEFAULT_LFO_RATE);

type AudioEngineValue = {
  setOscFrequency: (index: number, hz: number) => void;
  setLfoRate: (hz: number) => void;
  setReverbGain: (chain: number, db: number) => void;
  setReverbPhase: (chain: number, inverted: boolean) => void;
  setReverbFrequency: (chain: number, hz: number) => void;
  setReverbResonance: (chain: number, percent: number) => void;
  setReverbDelay: (chain: number, ms: number) => void;
  setDryWet: (percent: number) => void;
};

const AudioEngineContext = createContext<AudioEngineValue | null>(null);

export function useAudioEngine() {
  const value = useContext(AudioEngineContext);
  if (!value) {
    throw new Error("useAudioEngine must be used within AudioEngineProvider");
  }

  return value;
}

type AudioEngineProviderProps = {
  children: ReactNode;
};

export default function AudioEngineProvider({
  children,
}: AudioEngineProviderProps) {
  const webViewRef = useRef<WebView>(null);
  const oscFreqsRef = useRef([
    DEFAULT_FREQ,
    DEFAULT_FREQ,
    DEFAULT_FREQ,
    DEFAULT_FREQ,
  ]);
  const lfoRateRef = useRef(DEFAULT_LFO_RATE);
  const gainDbRef = useRef([DEFAULT_GAIN_DB, DEFAULT_GAIN_DB]);
  const invertedRef = useRef([false, false]);
  const reverbFreqRef = useRef([DEFAULT_FREQ, DEFAULT_FREQ]);
  const resonanceRef = useRef([DEFAULT_RESONANCE, DEFAULT_RESONANCE]);
  const delayMsRef = useRef([DEFAULT_DELAY_MS, DEFAULT_DELAY_MS]);
  const dryWetRef = useRef(DEFAULT_DRY_WET);

  const inject = useCallback((script: string) => {
    webViewRef.current?.injectJavaScript(script);
  }, []);

  const applyAll = useCallback(() => {
    const webView = webViewRef.current;
    if (!webView) {
      return;
    }

    oscFreqsRef.current.forEach((hz, index) => {
      webView.injectJavaScript(`window.setFrequency(${index}, ${hz}); true;`);
    });
    webView.injectJavaScript(
      `window.setLfoRate(${lfoRateRef.current}); true;`,
    );
    for (let chain = 0; chain < 2; chain++) {
      webView.injectJavaScript(
        `window.setReverbGain(${chain}, ${gainDbRef.current[chain]}); true;`,
      );
      webView.injectJavaScript(
        `window.setReverbPhase(${chain}, ${invertedRef.current[chain] ? 1 : 0}); true;`,
      );
      webView.injectJavaScript(
        `window.setReverbFrequency(${chain}, ${reverbFreqRef.current[chain]}); true;`,
      );
      webView.injectJavaScript(
        `window.setReverbResonance(${chain}, ${resonanceRef.current[chain]}); true;`,
      );
      webView.injectJavaScript(
        `window.setReverbDelay(${chain}, ${delayMsRef.current[chain]}); true;`,
      );
    }
    webView.injectJavaScript(
      `window.setDryWet(${dryWetRef.current}); true;`,
    );
  }, []);

  const setOscFrequency = useCallback(
    (index: number, hz: number) => {
      oscFreqsRef.current[index] = hz;
      inject(`window.setFrequency(${index}, ${hz}); true;`);
    },
    [inject],
  );

  const setLfoRate = useCallback(
    (hz: number) => {
      lfoRateRef.current = hz;
      inject(`window.setLfoRate(${hz}); true;`);
    },
    [inject],
  );

  const setReverbGain = useCallback(
    (chain: number, db: number) => {
      gainDbRef.current[chain] = db;
      inject(`window.setReverbGain(${chain}, ${db}); true;`);
    },
    [inject],
  );

  const setReverbPhase = useCallback(
    (chain: number, inverted: boolean) => {
      invertedRef.current[chain] = inverted;
      inject(
        `window.setReverbPhase(${chain}, ${inverted ? 1 : 0}); true;`,
      );
    },
    [inject],
  );

  const setReverbFrequency = useCallback(
    (chain: number, hz: number) => {
      reverbFreqRef.current[chain] = hz;
      inject(`window.setReverbFrequency(${chain}, ${hz}); true;`);
    },
    [inject],
  );

  const setReverbResonance = useCallback(
    (chain: number, percent: number) => {
      resonanceRef.current[chain] = percent;
      inject(`window.setReverbResonance(${chain}, ${percent}); true;`);
    },
    [inject],
  );

  const setReverbDelay = useCallback(
    (chain: number, ms: number) => {
      delayMsRef.current[chain] = ms;
      inject(`window.setReverbDelay(${chain}, ${ms}); true;`);
    },
    [inject],
  );

  const setDryWet = useCallback(
    (percent: number) => {
      dryWetRef.current = percent;
      inject(`window.setDryWet(${percent}); true;`);
    },
    [inject],
  );

  const value = useMemo(
    () => ({
      setOscFrequency,
      setLfoRate,
      setReverbGain,
      setReverbPhase,
      setReverbFrequency,
      setReverbResonance,
      setReverbDelay,
      setDryWet,
    }),
    [
      setOscFrequency,
      setLfoRate,
      setReverbGain,
      setReverbPhase,
      setReverbFrequency,
      setReverbResonance,
      setReverbDelay,
      setDryWet,
    ],
  );

  return (
    <AudioEngineContext.Provider value={value}>
      <View className="flex-1">
        <View
          className="absolute h-px w-px overflow-hidden opacity-0"
          pointerEvents="none"
        >
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: ENGINE_HTML }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            onLoadEnd={applyAll}
          />
        </View>
        {children}
      </View>
    </AudioEngineContext.Provider>
  );
}
