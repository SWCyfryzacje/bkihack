import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Voting } from '@/types/type';

type Props = {
  item: Voting;
};

export default function HomeVotingListItem({ item }: Props) {
  return (
    <View className='flex-col justify-between gap-2 rounded-xl border border-neutral-200 p-4'>
      <View className='flex-col gap-2'>
        <Text className='font-hd text-center text-lg font-bold text-neutral-900'>
          {item.title}
        </Text>
        <Text className='font-hd text-center text-sm text-neutral-500'>
          {item.description}
        </Text>
      </View>
      <View className='flex-row'>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/voting-details',
              params: { id: item.id },
            })
          }
          accessibilityRole='button'
          className='bg-accent-500 active:bg-accent-600 w-full rounded-md p-2'>
          <Text className='font-hd text-center text-lg font-bold text-neutral-900'>
            Szczegóły
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
