import { FlatList, Pressable, Text, View } from 'react-native';
import SafeView from '@/components/safe-view';
import { VOTINGS } from '@/constants/votings';

export default function Home() {
  return (
    <SafeView className='bg-canvas flex-1 flex-col gap-2 p-6'>
      <View className='border-b border-neutral-200 pb-2'>
        <Text className='font-hd text-xl text-neutral-900'>Witaj, Marcel</Text>
      </View>
      <View className='flex-1'>
        <FlatList
          ListHeaderComponent={
            <Text className='font-hd text-3xl font-bold text-neutral-900'>
              Aktualne głosowania
            </Text>
          }
          ListHeaderComponentStyle={{ marginBottom: 12 }}
          data={VOTINGS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable className='flex-row items-center justify-between gap-2 rounded-xl border border-neutral-200 p-4'>
              <View className='flex-col gap-2'>
                <Text className='font-hd text-lg font-bold text-neutral-900'>
                  {item.title}
                </Text>
                <Text className='font-hd text-sm text-neutral-500'>
                  {item.description}
                </Text>
              </View>
              <View className='flex-row'>
                <Pressable className='border-primary-400 rounded-md border px-4 py-2'>
                  <Text className='font-hd text-sm font-bold text-neutral-900'>
                    Szczegóły
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={<View className='h-4'></View>}
        />
      </View>
    </SafeView>
  );
}
