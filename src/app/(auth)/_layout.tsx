import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuth } from '@clerk/expo';
import LoadingScreen from '@/components/loading-screen';
import SafeView from '@/components/safe-view';
import { isProfileComplete } from '@/repositories/profile-repository';

type ProfileStatus = 'loading' | 'complete' | 'incomplete' | 'error';

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const isOnboardingRoute = pathname.endsWith('/onboarding');
  const [retryCount, setRetryCount] = useState(0);
  const checkKey = `${isSignedIn}:${isOnboardingRoute}:${retryCount}`;
  const [profileCheck, setProfileCheck] = useState<{
    key: string;
    status: Exclude<ProfileStatus, 'loading'>;
  }>({ key: '', status: 'error' });
  const profileStatus =
    profileCheck.key === checkKey ? profileCheck.status : 'loading';

  useEffect(() => {
    if (!isLoaded || !isSignedIn || isOnboardingRoute) return;

    let active = true;
    isProfileComplete()
      .then((complete) => {
        if (active) {
          setProfileCheck({
            key: checkKey,
            status: complete ? 'complete' : 'incomplete',
          });
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to check onboarding profile:', error);
        if (active) setProfileCheck({ key: checkKey, status: 'error' });
      });

    return () => {
      active = false;
    };
  }, [checkKey, isLoaded, isOnboardingRoute, isSignedIn]);

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn && isOnboardingRoute) {
    return <Redirect href='/(auth)/sign-in' />;
  }

  if (isSignedIn && isOnboardingRoute) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='onboarding'
          options={{ gestureEnabled: false }}
        />
      </Stack>
    );
  }

  if (isSignedIn && profileStatus === 'loading') {
    return <LoadingScreen message='Sprawdzamy profil…' />;
  }

  if (isSignedIn && profileStatus === 'error') {
    return (
      <SafeView className='bg-canvas flex-1 items-center justify-center p-6'>
        <View className='items-center gap-4'>
          <Text className='font-cnt text-center text-base text-neutral-700'>
            Nie udało się sprawdzić profilu. Sprawdź połączenie i spróbuj
            ponownie.
          </Text>
          <Pressable
            accessibilityRole='button'
            className='bg-accent-500 rounded-xl px-4 py-3'
            onPress={() => setRetryCount((count) => count + 1)}>
            <Text className='font-cnt-bold text-base text-white'>
              Spróbuj ponownie
            </Text>
          </Pressable>
        </View>
      </SafeView>
    );
  }

  if (isSignedIn) {
    return (
      <Redirect
        href={profileStatus === 'complete' ? '/(tabs)' : '/(auth)/onboarding'}
      />
    );
  }

  return (
    <Stack
      initialRouteName='sign-in'
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name='sign-in' />
      <Stack.Screen name='sign-up' />
      <Stack.Screen
        name='onboarding'
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
