import { Pressable, Text } from 'react-native';

type Props = {
  name: string;
  selected: boolean;
  onPress: () => void;
};

export default function AreaRow({ name, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg px-3 py-2.5 ${
        selected ? 'bg-primary-500' : 'active:bg-primary-50'
      }`}>
      <Text
        className={`text-sm ${
          selected ? 'font-cnt-bold text-white' : 'font-cnt text-neutral-800'
        }`}>
        {name}
      </Text>
    </Pressable>
  );
}
