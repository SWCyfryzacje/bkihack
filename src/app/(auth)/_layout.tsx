import { Redirect, Stack } from 'expo-router';
// import LoadingScreen from '@/components/loading-screen';
// import SafeView from '@/components/safe-view';
// import { Text, View } from 'react-native';

export default function RootLayout() {
  // if (!isLoaded) return <LoadingScreen />;
  // if (isSignedIn) return <Redirect href='/(tabs)' />;

  return <Redirect href='/(tabs)' />;

  // return (
  //   <Stack
  //     initialRouteName='sign-in'
  //     screenOptions={{ headerShown: false }}>
  //     <Stack.Screen name='sign-in' />
  //     <Stack.Screen name='sign-up' />
  //   </Stack>
  // );
}
