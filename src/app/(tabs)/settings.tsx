import SafeView from '@/components/safe-view';
import ConnectAiLink from '@/components/connect-ai/connect-ai-link';
import AccountInfoCard from '@/components/settings/account-info-card';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Settings() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeView className='bg-canvas flex-1 p-6'>
      <View className='gap-6'>
        <Text className='font-hd-bold text-3xl text-neutral-900'>
          Ustawienia
        </Text>

        <AccountInfoCard />

        <ConnectAiLink />

        <Pressable
          onPress={handleSignOut}
          accessibilityRole='button'
          className='bg-accent-500 active:bg-accent-600 items-center rounded-xl px-4 py-4'>
          <Text className='font-cnt-bold text-base text-white'>Wyloguj</Text>
        </Pressable>
      </View>
    </SafeView>
  );
}
