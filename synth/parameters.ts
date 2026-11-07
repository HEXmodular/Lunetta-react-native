export const KEYBOARD_ROWS_MIN = 8;
export const KEYBOARD_ROWS_MAX = 16;
export const KEYBOARD_ROWS_DEFAULT = 8;

export const OSC_SEMITONES_MIN = -72;
export const OSC_SEMITONES_MAX = 72;
export const LFO_RATE_MIN = 0.1;
export const LFO_RATE_MAX = 20;
export const PERCENT_MIN = 0;
export const PERCENT_MAX = 100;
export const GAIN_DB_MIN = -100;
export const GAIN_DB_MAX = 24;
export const DELAY_MS_MIN = 0;
export const DELAY_MS_MAX = 10000;

export type ContinuousParamId =
  | "osc1"
  | "osc2"
  | "osc3"
  | "osc4"
  | "lfoRate"
  | "oscVolume"
  | "reverb1Gain"
  | "reverb1Freq"
  | "reverb1Resonance"
  | "reverb1Delay"
  | "reverb2Gain"
  | "reverb2Freq"
  | "reverb2Resonance"
  | "reverb2Delay"
  | "dryWet"
  | "masterVolume";

export type SynthParamValues = {
  osc1: number;
  osc2: number;
  osc3: number;
  osc4: number;
  lfoRate: number;
  oscVolume: number;
  reverb1Gain: number;
  reverb1Freq: number;
  reverb1Resonance: number;
  reverb1Delay: number;
  reverb1PhaseInvert: boolean;
  reverb2Gain: number;
  reverb2Freq: number;
  reverb2Resonance: number;
  reverb2Delay: number;
  reverb2PhaseInvert: boolean;
  dryWet: number;
  masterVolume: number;
  keyboardRows: number;
};

export type ContinuousParamDef = {
  id: ContinuousParamId;
  label: string;
  min: number;
  max: number;
};

export const CONTINUOUS_PARAMS: readonly ContinuousParamDef[] = [
  { id: "osc1", label: "Oscillator 1", min: OSC_SEMITONES_MIN, max: OSC_SEMITONES_MAX },
  { id: "osc2", label: "Oscillator 2", min: OSC_SEMITONES_MIN, max: OSC_SEMITONES_MAX },
  { id: "osc3", label: "Oscillator 3", min: OSC_SEMITONES_MIN, max: OSC_SEMITONES_MAX },
  { id: "osc4", label: "Oscillator 4", min: OSC_SEMITONES_MIN, max: OSC_SEMITONES_MAX },
  { id: "lfoRate", label: "LFO", min: LFO_RATE_MIN, max: LFO_RATE_MAX },
  { id: "oscVolume", label: "Volume", min: PERCENT_MIN, max: PERCENT_MAX },
  {
    id: "reverb1Gain",
    label: "Reverb 1 Gain",
    min: GAIN_DB_MIN,
    max: GAIN_DB_MAX,
  },
  {
    id: "reverb1Freq",
    label: "Reverb 1 Frequency",
    min: OSC_SEMITONES_MIN,
    max: OSC_SEMITONES_MAX,
  },
  {
    id: "reverb1Resonance",
    label: "Reverb 1 Resonance",
    min: PERCENT_MIN,
    max: PERCENT_MAX,
  },
  {
    id: "reverb1Delay",
    label: "Reverb 1 Delay",
    min: DELAY_MS_MIN,
    max: DELAY_MS_MAX,
  },
  {
    id: "reverb2Gain",
    label: "Reverb 2 Gain",
    min: GAIN_DB_MIN,
    max: GAIN_DB_MAX,
  },
  {
    id: "reverb2Freq",
    label: "Reverb 2 Frequency",
    min: OSC_SEMITONES_MIN,
    max: OSC_SEMITONES_MAX,
  },
  {
    id: "reverb2Resonance",
    label: "Reverb 2 Resonance",
    min: PERCENT_MIN,
    max: PERCENT_MAX,
  },
  {
    id: "reverb2Delay",
    label: "Reverb 2 Delay",
    min: DELAY_MS_MIN,
    max: DELAY_MS_MAX,
  },
  { id: "dryWet", label: "Dry/Wet", min: PERCENT_MIN, max: PERCENT_MAX },
  {
    id: "masterVolume",
    label: "Master",
    min: PERCENT_MIN,
    max: PERCENT_MAX,
  },
] as const;

export const DEFAULT_PARAM_VALUES: SynthParamValues = {
  osc1: 0,
  osc2: 0,
  osc3: 0,
  osc4: 0,
  lfoRate: 1,
  oscVolume: 100,
  reverb1Gain: 0,
  reverb1Freq: 0,
  reverb1Resonance: 0,
  reverb1Delay: 0,
  reverb1PhaseInvert: false,
  reverb2Gain: 0,
  reverb2Freq: 0,
  reverb2Resonance: 0,
  reverb2Delay: 0,
  reverb2PhaseInvert: false,
  dryWet: 50,
  masterVolume: 100,
  keyboardRows: KEYBOARD_ROWS_DEFAULT,
};

export type CcMappings = Partial<Record<ContinuousParamId, number>>;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function mapCcToParam(ccValue: number, min: number, max: number) {
  const normalized = clamp(ccValue, 0, 127) / 127;
  return min + normalized * (max - min);
}

export function continuousParamDef(
  id: ContinuousParamId,
): ContinuousParamDef | undefined {
  return CONTINUOUS_PARAMS.find((param) => param.id === id);
}
