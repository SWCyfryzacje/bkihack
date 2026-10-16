import { Text, View } from 'react-native';

export default function FormInfo({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <View className='border-success bg-success-light rounded-xl border px-4 py-3'>
      <Text className='font-cnt text-success text-sm'>{message}</Text>
    </View>
  );
}
