import { Pressable, Text } from 'react-native';

export default function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole='radio'
      accessibilityState={{ selected }}
      className={`rounded-full border px-4 py-2 ${
        selected
          ? 'border-primary-600 bg-primary-600'
          : 'bg-surface border-neutral-200 active:bg-neutral-100'
      }`}>
      <Text
        className={`font-sans-medium text-sm ${selected ? 'text-white' : 'text-neutral-700'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
