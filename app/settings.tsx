import KeyboardRowsSettingRow from "@/components/settings/KeyboardRowsSettingRow";
import MidiParametersSectionHeader from "@/components/settings/MidiParametersSectionHeader";
import ParameterLearnRow from "@/components/settings/ParameterLearnRow";
import {
  CONTINUOUS_PARAMS,
  KEYBOARD_ROWS_MAX,
  KEYBOARD_ROWS_MIN,
  clamp,
} from "@/synth/parameters";
import { useSynthSettings } from "@/synth/SynthSettingsProvider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    values,
    ccMappings,
    learningParamId,
    setParam,
    startLearn,
    cancelLearn,
  } = useSynthSettings();

  useEffect(() => {
    return () => {
      cancelLearn();
    };
  }, [cancelLearn]);

  const handleKeyboardRowsChange = useCallback(
    (next: number) => {
      setParam(
        "keyboardRows",
        Math.round(clamp(next, KEYBOARD_ROWS_MIN, KEYBOARD_ROWS_MAX)),
      );
    },
    [setParam],
  );

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="flex-row items-center px-3 py-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#f4f6fa" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        <KeyboardRowsSettingRow
          value={values.keyboardRows}
          min={KEYBOARD_ROWS_MIN}
          max={KEYBOARD_ROWS_MAX}
          onChange={handleKeyboardRowsChange}
        />
        <MidiParametersSectionHeader />
        {CONTINUOUS_PARAMS.map((param) => (
          <ParameterLearnRow
            key={param.id}
            label={param.label}
            paramId={param.id}
            mappedCc={ccMappings[param.id]}
            learning={learningParamId === param.id}
            onLearn={startLearn}
            onCancelLearn={cancelLearn}
          />
        ))}
      </ScrollView>
    </View>
  );
}
