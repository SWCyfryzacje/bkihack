import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { ClerkProvider, useAuth } from '@clerk/expo';
import LoadingScreen from '@/components/loading-screen';
import { tokenCache } from '@clerk/expo/token-cache';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function RootLayoutContent() {
  const { isLoaded: authLoaded } = useAuth();

  const [fontsLoaded] = useFonts({
    interRegular: require('../../assets/fonts/Inter_Regular.ttf'),
    interLight: require('../../assets/fonts/Inter_Light.ttf'),
    interThin: require('../../assets/fonts/Inter_Thin.ttf'),
    interBold: require('../../assets/fonts/Inter_Bold.ttf'),
    jakartaRegular: require('../../assets/fonts/Jakarta_Regular.ttf'),
    jakartaLight: require('../../assets/fonts/Jakarta_Light.ttf'),
    jakartaBold: require('../../assets/fonts/Jakarta_Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoaded]);

  if (!fontsLoaded || !authLoaded) return <LoadingScreen />;

  return (
    <>
      <StatusBar style='dark' />

      <Stack
        initialRouteName='(auth)'
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}>
      <RootLayoutContent />
    </ClerkProvider>
  );
}
