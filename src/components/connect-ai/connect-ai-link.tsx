import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';

// Przycisk na Panelu prowadzący do ekranu z adresem connectora MCP.
export default function ConnectAiLink() {
  return (
    <Pressable
      onPress={() => router.push('/connect-ai')}
      accessibilityRole='button'
      className='border-primary-200 bg-primary-50 active:bg-primary-100 rounded-xl border px-4 py-3'>
      <Text className='font-cnt-bold text-primary-700 text-center text-base'>
        🤖 Połącz z AI (Claude / ChatGPT)
      </Text>
    </Pressable>
  );
}
