import { useAudioEngine } from "@/audio/AudioEngineProvider";
import { useMidiInput } from "@/audio/useMidiInput";
import {
  CONTINUOUS_PARAMS,
  DEFAULT_PARAM_VALUES,
  clamp,
  mapCcToParam,
  type CcMappings,
  type ContinuousParamId,
  type SynthParamValues,
} from "@/synth/parameters";
import {
  loadCcMappings,
  loadUiSettings,
  saveCcMappings,
  saveUiSettings,
} from "@/synth/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const A4_HZ = 440;

function semitonesToHz(semitones: number) {
  return A4_HZ * 2 ** (semitones / 12);
}

type SynthSettingsValue = {
  values: SynthParamValues;
  ccMappings: CcMappings;
  learningParamId: ContinuousParamId | null;
  setParam: <K extends keyof SynthParamValues>(
    key: K,
    value: SynthParamValues[K],
  ) => void;
  startLearn: (paramId: ContinuousParamId) => void;
  cancelLearn: () => void;
};

const SynthSettingsContext = createContext<SynthSettingsValue | null>(null);

export function useSynthSettings() {
  const value = useContext(SynthSettingsContext);
  if (!value) {
    throw new Error("useSynthSettings must be used within SynthSettingsProvider");
  }
  return value;
}

type SynthSettingsProviderProps = {
  children: ReactNode;
};

export default function SynthSettingsProvider({
  children,
}: SynthSettingsProviderProps) {
  const engine = useAudioEngine();
  const [values, setValues] = useState<SynthParamValues>(DEFAULT_PARAM_VALUES);
  const [ccMappings, setCcMappings] = useState<CcMappings>({});
  const [learningParamId, setLearningParamId] =
    useState<ContinuousParamId | null>(null);

  const valuesRef = useRef<SynthParamValues>(DEFAULT_PARAM_VALUES);
  const ccMappingsRef = useRef<CcMappings>({});
  const learningParamIdRef = useRef<ContinuousParamId | null>(null);
  const engineRef = useRef(engine);

  valuesRef.current = values;
  ccMappingsRef.current = ccMappings;
  learningParamIdRef.current = learningParamId;
  engineRef.current = engine;

  const applyEngineFromValues = useCallback((next: SynthParamValues) => {
    const audio = engineRef.current;
    audio.setOscFrequency(0, semitonesToHz(next.osc1));
    audio.setOscFrequency(1, semitonesToHz(next.osc2));
    audio.setOscFrequency(2, semitonesToHz(next.osc3));
    audio.setOscFrequency(3, semitonesToHz(next.osc4));
    audio.setLfoRate(next.lfoRate);
    audio.setOscVolume(next.oscVolume);
    audio.setReverbGain(0, next.reverb1Gain);
    audio.setReverbFrequency(0, semitonesToHz(next.reverb1Freq));
    audio.setReverbResonance(0, next.reverb1Resonance);
    audio.setReverbDelay(0, next.reverb1Delay);
    audio.setReverbPhase(0, next.reverb1PhaseInvert);
    audio.setReverbGain(1, next.reverb2Gain);
    audio.setReverbFrequency(1, semitonesToHz(next.reverb2Freq));
    audio.setReverbResonance(1, next.reverb2Resonance);
    audio.setReverbDelay(1, next.reverb2Delay);
    audio.setReverbPhase(1, next.reverb2PhaseInvert);
    audio.setDryWet(next.dryWet);
    audio.setMasterVolume(next.masterVolume);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [savedMappings, uiSettings] = await Promise.all([
        loadCcMappings(),
        loadUiSettings(),
      ]);
      if (cancelled) {
        return;
      }
      const next = {
        ...DEFAULT_PARAM_VALUES,
        keyboardRows: uiSettings.keyboardRows,
      };
      valuesRef.current = next;
      setValues(next);
      setCcMappings(savedMappings);
      applyEngineFromValues(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [applyEngineFromValues]);

  const persistMappings = useCallback(async (next: CcMappings) => {
    setCcMappings(next);
    ccMappingsRef.current = next;
    await saveCcMappings(next);
  }, []);

  const persistUiSettings = useCallback(async () => {
    await saveUiSettings({
      keyboardRows: valuesRef.current.keyboardRows,
    });
  }, []);

  const setParam = useCallback(
    <K extends keyof SynthParamValues>(key: K, value: SynthParamValues[K]) => {
      setValues((current) => {
        const next = { ...current, [key]: value };
        valuesRef.current = next;

        const audio = engineRef.current;
        switch (key) {
          case "osc1":
            audio.setOscFrequency(0, semitonesToHz(value as number));
            break;
          case "osc2":
            audio.setOscFrequency(1, semitonesToHz(value as number));
            break;
          case "osc3":
            audio.setOscFrequency(2, semitonesToHz(value as number));
            break;
          case "osc4":
            audio.setOscFrequency(3, semitonesToHz(value as number));
            break;
          case "lfoRate":
            audio.setLfoRate(value as number);
            break;
          case "oscVolume":
            audio.setOscVolume(value as number);
            break;
          case "reverb1Gain":
            audio.setReverbGain(0, value as number);
            break;
          case "reverb1Freq":
            audio.setReverbFrequency(0, semitonesToHz(value as number));
            break;
          case "reverb1Resonance":
            audio.setReverbResonance(0, value as number);
            break;
          case "reverb1Delay":
            audio.setReverbDelay(0, value as number);
            break;
          case "reverb1PhaseInvert":
            audio.setReverbPhase(0, value as boolean);
            break;
          case "reverb2Gain":
            audio.setReverbGain(1, value as number);
            break;
          case "reverb2Freq":
            audio.setReverbFrequency(1, semitonesToHz(value as number));
            break;
          case "reverb2Resonance":
            audio.setReverbResonance(1, value as number);
            break;
          case "reverb2Delay":
            audio.setReverbDelay(1, value as number);
            break;
          case "reverb2PhaseInvert":
            audio.setReverbPhase(1, value as boolean);
            break;
          case "dryWet":
            audio.setDryWet(value as number);
            break;
          case "masterVolume":
            audio.setMasterVolume(value as number);
            break;
          default:
            break;
        }

        return next;
      });

      if (key === "keyboardRows") {
        void persistUiSettings();
      }
    },
    [persistUiSettings],
  );

  const startLearn = useCallback((paramId: ContinuousParamId) => {
    setLearningParamId(paramId);
    learningParamIdRef.current = paramId;
  }, []);

  const cancelLearn = useCallback(() => {
    setLearningParamId(null);
    learningParamIdRef.current = null;
  }, []);

  const applyContinuousFromCc = useCallback(
    (paramId: ContinuousParamId, ccValue: number) => {
      const def = CONTINUOUS_PARAMS.find((param) => param.id === paramId);
      if (!def) {
        return;
      }
      setParam(paramId, mapCcToParam(ccValue, def.min, def.max));
    },
    [setParam],
  );

  const handleControlChange = useCallback(
    (controller: number, value: number) => {
      const cc = Math.round(clamp(controller, 0, 127));
      const learning = learningParamIdRef.current;
      if (learning) {
        const next: CcMappings = { ...ccMappingsRef.current };
        for (const [paramId, mappedCc] of Object.entries(next)) {
          if (mappedCc === cc) {
            delete next[paramId as ContinuousParamId];
          }
        }
        next[learning] = cc;
        void persistMappings(next);
        setLearningParamId(null);
        learningParamIdRef.current = null;
        applyContinuousFromCc(learning, value);
        return;
      }

      for (const [paramId, mappedCc] of Object.entries(ccMappingsRef.current)) {
        if (mappedCc === cc) {
          applyContinuousFromCc(paramId as ContinuousParamId, value);
          return;
        }
      }
    },
    [applyContinuousFromCc, persistMappings],
  );

  useMidiInput({
    onNoteOn: () => {},
    onNoteOff: () => {},
    onControlChange: handleControlChange,
  });

  const value = useMemo<SynthSettingsValue>(
    () => ({
      values,
      ccMappings,
      learningParamId,
      setParam,
      startLearn,
      cancelLearn,
    }),
    [values, ccMappings, learningParamId, setParam, startLearn, cancelLearn],
  );

  return (
    <SynthSettingsContext.Provider value={value}>
      {children}
    </SynthSettingsContext.Provider>
  );
}
