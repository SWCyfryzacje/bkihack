import { Pressable, Text, View } from 'react-native';
import { Voting } from '@/types/type';

type Props = {
  item: Voting;
};

export default function HomeVotingListItem({ item }: Props) {
  return (
    <Pressable className='flex-col items-center justify-between gap-2 rounded-xl border border-neutral-200 p-4'>
      <View className='flex-col gap-2'>
        <Text className='font-hd text-lg font-bold text-neutral-900'>
          {item.title}
        </Text>
        <Text className='font-hd text-sm text-neutral-500'>
          {item.description}
        </Text>
      </View>
      <View className='flex-row'>
        <Pressable className='bg-primary-100 w-full rounded-md p-2'>
          <Text className='font-hd text-center text-lg font-bold text-neutral-900'>
            Szczegóły
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
