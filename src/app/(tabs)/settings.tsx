import SafeView from '@/components/safe-view';
import { useAuth, useUser } from '@clerk/expo';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Settings() {
  const { signOut } = useAuth();
  const { isLoaded, user } = useUser();

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

        <View className='bg-surface gap-4 rounded-2xl border border-neutral-200 p-5'>
          <Text className='font-hd-bold text-xl text-neutral-900'>
            Informacje o koncie
          </Text>
          {isLoaded ? (
            <>
              <View className='gap-1'>
                <Text className='font-cnt-bold text-sm text-neutral-600'>
                  Imię i nazwisko
                </Text>
                <Text className='font-cnt text-base text-neutral-900'>
                  {user?.fullName || user?.firstName || 'Użytkownik'}
                </Text>
              </View>
              <View className='gap-1'>
                <Text className='font-cnt-bold text-sm text-neutral-600'>
                  Adres e-mail
                </Text>
                <Text className='font-cnt text-base text-neutral-900'>
                  {user?.primaryEmailAddress?.emailAddress ||
                    'Brak adresu e-mail'}
                </Text>
              </View>
            </>
          ) : (
            <Text className='font-cnt text-base text-neutral-600'>
              Ładowanie danych użytkownika...
            </Text>
          )}
        </View>

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
