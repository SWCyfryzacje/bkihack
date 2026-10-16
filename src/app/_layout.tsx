import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import '@/global.css';
import { useEffect, useState } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
