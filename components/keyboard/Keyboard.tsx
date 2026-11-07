import FoldButton from "@/components/keyboard/FoldButton";
import ShiftButton from "@/components/keyboard/ShiftButton";
import {
  cellAtPoint,
  cellMidi,
  describeNote,
  KEY_GAP,
  KEYBOARD_COLUMN_COUNT,
  KEYBOARD_ROW_COUNT,
  midiOctave,
  rowOffsetLimits,
  voicesOnNote,
  type KeyboardNote,
} from "@/components/keyboard/notes";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type { KeyboardNote };

type KeyboardProps = {
  /** MIDI note per oscillator voice (length 4). Voices stay active. */
  voiceMidis: readonly number[];
  onVoiceMidiChange: (voiceIndex: number, midi: number) => void;
  /** Visible string rows in the grid. */
  rowCount?: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /**
   * `assign` — tap a voice, then tap a note to move it.
   * `hold` — first voice stays selected; any note tap moves it immediately.
   */
  mode?: "assign" | "hold";
};

type StageSize = {
  width: number;
  height: number;
};

const NATURAL_COLOR = "#e7edf7";
const ACCIDENTAL_COLOR = "#152038";
const NATURAL_VOICE_COLOR = "#ea7a53";
const ACCIDENTAL_VOICE_COLOR = "#8a4034";
const NATURAL_SELECTED_COLOR = "#f0a286";
const ACCIDENTAL_SELECTED_COLOR = "#b85a48";

export default function Keyboard({
  voiceMidis,
  onVoiceMidiChange,
  rowCount = KEYBOARD_ROW_COUNT,
  expanded,
  onExpandedChange,
  mode = "assign",
}: KeyboardProps) {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<StageSize>({ width: 0, height: 0 });
  const [rowOffset, setRowOffset] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<number | null>(() =>
    mode === "hold" && voiceMidis.length > 0 ? 0 : null,
  );
  const showVoiceLabels = mode !== "hold" && voiceMidis.length > 1;

  const safeRowCount =
    Number.isFinite(rowCount) && rowCount >= 1
      ? Math.floor(rowCount)
      : KEYBOARD_ROW_COUNT;
  const columns =
    stage.width > 0 && stage.height > 0 ? KEYBOARD_COLUMN_COUNT : 0;
  const cellSize =
    columns > 0
      ? Math.min(
          (stage.height - KEY_GAP * (safeRowCount - 1)) / safeRowCount,
          (stage.width - KEY_GAP * (columns - 1)) / columns,
        )
      : 0;
  const limits = rowOffsetLimits(Math.max(columns, 1), safeRowCount);
  const visibleOffset = Math.min(limits.max, Math.max(limits.min, rowOffset));

  useEffect(() => {
    if (rowOffset !== visibleOffset) {
      setRowOffset(visibleOffset);
    }
  }, [rowOffset, visibleOffset]);

  useEffect(() => {
    setSelectedVoice(mode === "hold" && voiceMidis.length > 0 ? 0 : null);
  }, [expanded, mode, voiceMidis.length]);

  const handleGridTap = useCallback(
    (x: number, y: number) => {
      const cell = cellAtPoint(x, y, cellSize, KEY_GAP, columns, safeRowCount);
      if (!cell) {
        return;
      }

      const midi = cellMidi(visibleOffset, cell.row, cell.column, safeRowCount);
      const onNote = voicesOnNote(voiceMidis, midi);

      if (mode === "hold") {
        const voice = selectedVoice ?? 0;
        if (voiceMidis[voice] !== midi) {
          onVoiceMidiChange(voice, midi);
        }
        setSelectedVoice(voice);
        return;
      }

      if (selectedVoice == null) {
        if (onNote.length > 0) {
          setSelectedVoice(onNote[0]);
        }
        return;
      }

      if (voiceMidis[selectedVoice] === midi) {
        // Tap on the selected voice's own note cancels the transfer.
        setSelectedVoice(null);
        return;
      }

      onVoiceMidiChange(selectedVoice, midi);
      setSelectedVoice(null);
    },
    [
      cellSize,
      columns,
      mode,
      onVoiceMidiChange,
      safeRowCount,
      selectedVoice,
      visibleOffset,
      voiceMidis,
    ],
  );

  const keyboardGesture = useMemo(
    () =>
      Gesture.Tap().onEnd((event) => {
        runOnJS(handleGridTap)(event.x, event.y);
      }),
    [handleGridTap],
  );

  const handleStageLayout = useCallback((event: LayoutChangeEvent) => {
    const width = Math.floor(event.nativeEvent.layout.width);
    const height = Math.floor(event.nativeEvent.layout.height);
    setStage((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  }, []);

  const collapseKeyboard = useCallback(() => {
    onExpandedChange(false);
  }, [onExpandedChange]);

  const toggleExpanded = useCallback(() => {
    onExpandedChange(!expanded);
  }, [expanded, onExpandedChange]);

  const canShiftUp = columns > 0 && visibleOffset < limits.max;
  const canShiftDown = columns > 0 && visibleOffset > limits.min;
  const labelSize = Math.max(14, Math.round(cellSize * 0.32));
  const voiceLabelSize = Math.max(12, Math.round(cellSize * 0.28));
  const gridWidth =
    columns > 0 ? columns * cellSize + (columns - 1) * KEY_GAP : 0;
  const gridHeight =
    cellSize > 0 ? safeRowCount * cellSize + (safeRowCount - 1) * KEY_GAP : 0;

  if (!expanded) {
    return null;
  }

  return (
    <View
      className="min-h-0 w-full flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="px-2 pb-2">
        <FoldButton expanded onPress={toggleExpanded} />
      </View>

      <View className="min-h-0 flex-1 flex-row">
        <View
          className="flex-1 items-center justify-center"
          onLayout={handleStageLayout}
        >
          <Pressable
            accessibilityLabel="Dismiss Keyboard"
            accessibilityRole="button"
            onPress={collapseKeyboard}
            className="absolute inset-0"
            style={{ zIndex: 0 }}
          />
          {columns > 0 && cellSize > 0 ? (
            <GestureDetector gesture={keyboardGesture}>
              <View
                collapsable={false}
                accessibilityLabel="Keyboard"
                className="touch-none"
                style={{
                  width: gridWidth,
                  height: gridHeight,
                  zIndex: 1,
                  pointerEvents: "box-only",
                }}
              >
                {Array.from({ length: safeRowCount }, (_, row) => (
                  <View
                    key={row}
                    className="flex-row"
                    style={{
                      marginBottom: row < safeRowCount - 1 ? KEY_GAP : 0,
                      pointerEvents: "none",
                    }}
                  >
                    {Array.from({ length: columns }, (_, column) => {
                      const note = describeNote(
                        cellMidi(visibleOffset, row, column, safeRowCount),
                      );
                      const onNote = voicesOnNote(voiceMidis, note.midi);
                      const hasVoice = onNote.length > 0;
                      const isSelected =
                        selectedVoice != null &&
                        voiceMidis[selectedVoice] === note.midi;
                      const backgroundColor = isSelected
                        ? note.natural
                          ? NATURAL_SELECTED_COLOR
                          : ACCIDENTAL_SELECTED_COLOR
                        : hasVoice
                          ? note.natural
                            ? NATURAL_VOICE_COLOR
                            : ACCIDENTAL_VOICE_COLOR
                          : note.natural
                            ? NATURAL_COLOR
                            : ACCIDENTAL_COLOR;

                      return (
                        <View
                          key={column}
                          testID={`key-${row}-${column}`}
                          className="items-center justify-center"
                          style={{
                            width: cellSize,
                            height: cellSize,
                            marginRight: column < columns - 1 ? KEY_GAP : 0,
                            backgroundColor,
                            pointerEvents: "none",
                          }}
                        >
                          {note.natural ? (
                            <Text
                              style={{
                                fontSize: labelSize,
                                fontWeight: "600",
                                color: "#081126",
                                pointerEvents: "none",
                              }}
                            >
                              {note.name}
                            </Text>
                          ) : null}
                          {note.name === "C" ? (
                            <Text
                              style={{
                                position: "absolute",
                                right: Math.max(4, cellSize * 0.08),
                                bottom: Math.max(2, cellSize * 0.05),
                                fontSize: Math.max(
                                  11,
                                  Math.round(labelSize * 0.42),
                                ),
                                fontWeight: "600",
                                color: "#081126",
                                pointerEvents: "none",
                              }}
                            >
                              {midiOctave(note.midi)}
                            </Text>
                          ) : null}
                          {hasVoice && showVoiceLabels ? (
                            <View
                              className="absolute left-0 right-0 top-0 flex-row flex-wrap items-start justify-center"
                              style={{
                                paddingTop: Math.max(2, cellSize * 0.04),
                                pointerEvents: "none",
                              }}
                            >
                              {onNote
                                .slice()
                                .sort((a, b) => a - b)
                                .map((voiceIndex) => {
                                  const selected = selectedVoice === voiceIndex;
                                  return (
                                    <Text
                                      key={voiceIndex}
                                      style={{
                                        marginHorizontal: 1,
                                        fontSize: voiceLabelSize,
                                        fontWeight: "800",
                                        color: selected ? "#081126" : "#f4f6fa",
                                        textShadowColor: selected
                                          ? "transparent"
                                          : "#081126",
                                        textShadowOffset: { width: 0, height: 0 },
                                        textShadowRadius: selected ? 0 : 2,
                                        pointerEvents: "none",
                                      }}
                                    >
                                      {voiceIndex + 1}
                                    </Text>
                                  );
                                })}
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </GestureDetector>
          ) : null}
        </View>

        <View className="ml-2 h-full w-16 justify-between py-1">
          <ShiftButton
            label="На строку вверх"
            glyph="▲"
            disabled={!canShiftUp}
            onPress={() => setRowOffset((current) => current + 1)}
          />
          <ShiftButton
            label="На строку вниз"
            glyph="▼"
            disabled={!canShiftDown}
            onPress={() => setRowOffset((current) => current - 1)}
          />
        </View>
      </View>
    </View>
  );
}
