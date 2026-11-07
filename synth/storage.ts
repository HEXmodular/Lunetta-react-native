import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CONTINUOUS_PARAMS,
  DEFAULT_PARAM_VALUES,
  KEYBOARD_ROWS_MAX,
  KEYBOARD_ROWS_MIN,
  clamp,
  type CcMappings,
  type ContinuousParamId,
  type SynthParamValues,
} from "@/synth/parameters";

const CC_MAPPINGS_KEY = "lunette/cc-mappings";
const UI_SETTINGS_KEY = "lunette/ui-settings";

const CONTINUOUS_IDS = new Set<string>(
  CONTINUOUS_PARAMS.map((param) => param.id),
);

type UiSettings = {
  keyboardRows: number;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseCcMappings(raw: string | null): CcMappings {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next: CcMappings = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!CONTINUOUS_IDS.has(key) || !isFiniteNumber(value)) {
        continue;
      }
      const cc = Math.round(value);
      if (cc < 0 || cc > 127) {
        continue;
      }
      next[key as ContinuousParamId] = cc;
    }
    return next;
  } catch {
    return {};
  }
}

function parseUiSettings(raw: string | null): UiSettings {
  if (!raw) {
    return { keyboardRows: DEFAULT_PARAM_VALUES.keyboardRows };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UiSettings>;
    const keyboardRows = isFiniteNumber(parsed.keyboardRows)
      ? Math.round(
          clamp(parsed.keyboardRows, KEYBOARD_ROWS_MIN, KEYBOARD_ROWS_MAX),
        )
      : DEFAULT_PARAM_VALUES.keyboardRows;
    return { keyboardRows };
  } catch {
    return { keyboardRows: DEFAULT_PARAM_VALUES.keyboardRows };
  }
}

export async function loadCcMappings(): Promise<CcMappings> {
  return parseCcMappings(await AsyncStorage.getItem(CC_MAPPINGS_KEY));
}

export async function saveCcMappings(mappings: CcMappings): Promise<void> {
  await AsyncStorage.setItem(CC_MAPPINGS_KEY, JSON.stringify(mappings));
}

export async function loadUiSettings(): Promise<UiSettings> {
  return parseUiSettings(await AsyncStorage.getItem(UI_SETTINGS_KEY));
}

export async function saveUiSettings(settings: UiSettings): Promise<void> {
  await AsyncStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings));
}

export type { UiSettings };
