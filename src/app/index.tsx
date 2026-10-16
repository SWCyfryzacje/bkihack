import { Pressable, Text, View } from 'react-native';
import SafeView from '@/components/safe-view';

export default function App() {
  return (
    <SafeView className='bg-canvas flex-1 items-center justify-center p-4'>
      <View className='bg-surface rounded-2xl border border-neutral-200 p-4'>
        <Text className='text-center font-bold text-neutral-900'>Gooday</Text>
      </View>
    </SafeView>
  );
}
