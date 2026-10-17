import { FlatList, Pressable, Text, View } from 'react-native';
import SafeView from '@/components/safe-view';
import HomeVotingListItem from '@/components/home-voting-list-item';
import VotingListEmptyState from '@/components/voting-list-empty-state';
import { useVotings } from '@/hooks/use-votings';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { useEffect, useState } from 'react';

dayjs.locale('pl');

export default function Home() {
  const [time, setTime] = useState(dayjs().format('dddd, DD MMMM YYYY, HH:mm'));
  const { votings, loading, error, retry } = useVotings();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('dddd, DD MMMM YYYY, HH:mm'));
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  return (
    <SafeView className='bg-canvas flex-1 flex-col gap-2 p-6 pb-0'>
      <View className='border-b border-neutral-200 pb-2'>
        <View className='flex-row items-center justify-between'>
          <Text className='font-hd text-xl text-neutral-900'>
            Witaj, <Text className='font-bold'>Marcel</Text>
          </Text>
          <Pressable
            onPress={handleSignOut}
            accessibilityRole='button'
            className='rounded-lg border border-neutral-300 px-3 py-2 active:bg-neutral-100'>
            <Text className='font-cnt-bold text-sm text-neutral-700'>Wyloguj</Text>
          </Pressable>
        </View>
        <Text className='mt-1 text-right text-lg text-neutral-700'>{time}</Text>
      </View>
      <View className='flex-1'>
        <FlatList
          ListHeaderComponent={
            <View>
              <Text className='font-hd text-center text-4xl font-bold text-neutral-900'>
                Aktualne głosowania
              </Text>
              <Text className='font-hd text-center text-lg text-neutral-700'>
                Głosowania aktywne w twoim regionie
              </Text>
            </View>
          }
          ListHeaderComponentStyle={{ marginBottom: 12 }}
          ListFooterComponent={<View className='h-4'></View>}
          data={votings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HomeVotingListItem item={item} />}
          ItemSeparatorComponent={<View className='h-4'></View>}
          ListEmptyComponent={
            <VotingListEmptyState loading={loading} error={error} onRetry={retry} />
          }
        />
      </View>
    </SafeView>
  );
}
