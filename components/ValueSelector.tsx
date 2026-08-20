import { Pressable, Text, View } from "react-native";

type ValueSelectorProps<T extends string | number> = {
  values: readonly T[];
  selectedIndex: number;
  onChange: (value: T, index: number) => void;
  formatLabel?: (value: T) => string;
};

function defaultFormat(value: string | number) {
  return String(value);
}

export default function ValueSelector<T extends string | number>({
  values,
  selectedIndex,
  onChange,
  formatLabel = defaultFormat,
}: ValueSelectorProps<T>) {
  return (
    <View className="w-full flex-row items-center">
      {values.map((item, index) => {
        const selected = index === selectedIndex;

        return (
          <Pressable
            key={index}
            onPress={() => onChange(item, index)}
            className={`flex-1 items-center rounded-lg border px-1 py-2 ${
              selected ? "border-primary" : "border-transparent"
            }`}
          >
            <Text
              className={`font-sans-medium text-sm ${
                selected ? "text-primary" : "text-primary/40"
              }`}
            >
              {formatLabel(item)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
