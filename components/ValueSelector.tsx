import { Pressable, Text, View } from "react-native";

type ValueSelectorProps<T extends string | number> = {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
};

function defaultFormat(value: string | number) {
  // if (typeof value === "number" && value > 0) {
  //   return `+${value}`;
  // }

  return String(value);
}

export default function ValueSelector<T extends string | number>({
  values,
  value,
  onChange,
  formatLabel = defaultFormat,
}: ValueSelectorProps<T>) {
  return (
    <View className="w-full flex-row items-center">
      {values.map((item) => {
        const selected = item === value;

        return (
          <Pressable
            key={String(item)}
            onPress={() => onChange(item)}
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
