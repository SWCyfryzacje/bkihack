import { FlatList, Pressable, Text, View } from 'react-native';
import SafeView from '@/components/safe-view';
import HomeVotingListItem from '@/components/home-voting-list-item';
import VotingListEmptyState from '@/components/voting-list-empty-state';
import { useVotings } from '@/hooks/use-votings';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { useEffect, useState } from 'react';

dayjs.locale('pl');

export default function Home() {
  const [time, setTime] = useState(dayjs().format('dddd, DD MMMM YYYY, HH:mm'));
  const { votings, loading, error, retry } = useVotings();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('dddd, DD MMMM YYYY, HH:mm'));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeView className='bg-canvas flex-1 p-4 pb-0'>
      <View className='flex-1'>
        <FlatList
          ListHeaderComponent={
            <View className='gap-6'>
              <View className='bg-primary-700 rounded-3xl p-5'>
                <View className='bg-accent-400 mb-4 h-1 w-10 rounded-full' />
                <Text className='font-cnt-bold text-primary-100 text-xs tracking-widest'>
                  TWOJE MIASTO, TWÓJ GŁOS
                </Text>
                <Text className='font-hd-bold mt-2 text-3xl leading-10 text-white'>
                  Decyduj o swojej okolicy.
                </Text>
                <View className='mt-4 flex-row items-center gap-2'>
                  <View className='bg-accent-400 h-2 w-2 rounded-full' />
                  <Text className='font-cnt text-primary-100 text-sm'>
                    {time}
                  </Text>
                </View>
              </View>
              <View className='gap-1'>
                <View className='flex-row items-center justify-between gap-3'>
                  <Text className='font-hd-bold text-2xl text-neutral-900'>
                    Aktualne głosowania
                  </Text>
                  <Pressable
                    accessibilityRole='button'
                    accessibilityLabel='Odśwież głosowania'
                    disabled={loading}
                    onPress={retry}
                    className='rounded-full bg-primary-50 px-3 py-2'>
                    <Text className='font-cnt-bold text-sm text-primary-700'>
                      Odśwież
                    </Text>
                  </Pressable>
                </View>
                <Text className='font-cnt text-base text-neutral-600'>
                  Sprawdź tematy ważne dla mieszkańców.
                </Text>
              </View>
            </View>
          }
          ListHeaderComponentStyle={{ marginBottom: 16 }}
          ListFooterComponent={<View className='h-4'></View>}
          data={votings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HomeVotingListItem item={item} />}
          ItemSeparatorComponent={<View className='h-3'></View>}
          ListEmptyComponent={
            <VotingListEmptyState
              loading={loading}
              error={error}
              onRetry={retry}
            />
          }
        />
      </View>
    </SafeView>
  );
}
