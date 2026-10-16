import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, setLoaded] = useState(true);

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
    if (loaded && fontsLoaded) SplashScreen.hideAsync();
  }, [loaded, fontsLoaded]);

  return (
    <>
      <StatusBar style='dark' />

      <Stack
        initialRouteName='(tabs)'
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
      </Stack>
    </>
  );
}
