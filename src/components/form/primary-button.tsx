import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
}: Props) {
  const inactive = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      className={`items-center rounded-xl py-4 ${
        inactive ? 'bg-accent-300' : 'bg-accent-500 active:bg-accent-600'
      }`}>
      {loading ? (
        <ActivityIndicator color='#ffffff' />
      ) : (
        <Text className='font-cnt-bold text-base text-white'>{title}</Text>
      )}
    </Pressable>
  );
}
