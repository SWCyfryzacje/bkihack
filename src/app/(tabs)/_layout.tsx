import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LoadingScreen from '@/components/loading-screen';
import TabBarIcon from '@/components/tab-bar-icon';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // if (!isLoaded) return <LoadingScreen />;
  // if (!isSignedIn) return <Redirect href='/(auth)/sign-in' />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          borderTopWidth: 1,
          height: 60 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Panel',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='report'
        options={{
          title: 'Zgłoszenie',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'megaphone-outline' : 'megaphone-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
