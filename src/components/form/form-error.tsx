import { Text, View } from 'react-native';

export default function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <View className='border-danger bg-danger-light rounded-xl border px-4 py-3'>
      <Text className='font-cnt text-danger text-sm'>{message}</Text>
    </View>
  );
}
