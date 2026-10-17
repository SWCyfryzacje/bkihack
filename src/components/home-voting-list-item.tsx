import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import VotingStageBadge from '@/components/voting-stage-badge';
import { CATEGORIES, SCOPES, type Voting } from '@/types/type';

type Props = {
  item: Voting;
};

export default function HomeVotingListItem({ item }: Props) {
  const categoryLabel =
    CATEGORIES.find(({ value }) => value === item.category)?.label ??
    item.category;
  const scopeLabel =
    SCOPES.find(({ value }) => value === item.scope)?.label ?? item.scope;

  return (
    <View className='bg-surface flex-col gap-4 rounded-2xl border border-neutral-200 p-5'>
      <View className='flex-row flex-wrap items-center justify-between gap-2'>
        <View className='flex-row flex-wrap items-center gap-2'>
          <View className='bg-primary-50 rounded-full px-3 py-1'>
            <Text className='font-cnt-bold text-primary-700 text-xs'>
              {categoryLabel}
            </Text>
          </View>
          <Text className='font-cnt text-xs text-neutral-600'>
            {scopeLabel}
          </Text>
          <VotingStageBadge voting={item} />
        </View>
        <View>
          {item.myVote !== null && (
            <View
              accessibilityLabel={
                item.myVote === 1 ? 'Twój głos: Za' : 'Twój głos: Przeciw'
              }
              className={`rounded-full px-3 py-1 ${
                item.myVote === 1 ? 'bg-success-light' : 'bg-danger-light'
              }`}>
              <Text
                className={`font-cnt-bold text-xs ${
                  item.myVote === 1 ? 'text-success' : 'text-danger'
                }`}>
                {item.myVote === 1 ? 'Głosujesz: Za' : 'Głosujesz: Przeciw'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View className='gap-2'>
        <Text className='font-hd-bold text-left text-xl text-neutral-900'>
          {item.title}
        </Text>
        <Text
          numberOfLines={3}
          className='font-cnt text-left text-sm leading-5 text-neutral-600'>
          {item.description}
        </Text>
      </View>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/voting-details',
            params: { id: item.id },
          })
        }
        accessibilityRole='button'
        className='active:bg-accent-600 bg-accent-500 flex-row items-center justify-center rounded-xl px-4 py-3'>
        <Text className='font-cnt-bold text-sm text-neutral-950'>
          Zobacz szczegóły
        </Text>
      </Pressable>
    </View>
  );
}
