import { Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export default function TextField({ label, error, ...inputProps }: Props) {
  const border = error ? 'border-danger' : 'border-neutral-200';

  return (
    <View className='gap-1.5'>
      <Text className='font-cnt-bold text-sm text-neutral-700'>{label}</Text>
      <TextInput
        placeholderTextColor='#9c9c95'
        className={`bg-surface font-cnt rounded-xl border px-4 py-3 text-base text-neutral-900 ${border}`}
        {...inputProps}
      />
      {error && <Text className='font-cnt text-danger text-xs'>{error}</Text>}
    </View>
  );
}
