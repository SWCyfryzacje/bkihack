import { Pressable, Text, View } from 'react-native';
import type { VotingVoteValue } from '@/types/type';

type VotingActionsProps = {
  myVote: VotingVoteValue | null;
  pendingVote: VotingVoteValue | null;
  error: string | null;
  onVote: (value: VotingVoteValue) => void;
};

const OPTIONS = [
  {
    value: 1,
    label: 'Za',
    selectedClassName: 'border-success bg-success',
    idleClassName: 'border-success/30 bg-success-light',
    idleTextClassName: 'text-success',
  },
  {
    value: -1,
    label: 'Przeciw',
    selectedClassName: 'border-danger bg-danger',
    idleClassName: 'border-danger/30 bg-danger-light',
    idleTextClassName: 'text-danger',
  },
] as const;

export default function VotingActions({
  myVote,
  pendingVote,
  error,
  onVote,
}: VotingActionsProps) {
  return (
    <View className='bg-surface gap-3 rounded-2xl border border-neutral-200 p-5'>
      <Text className='font-hd-bold text-xl text-neutral-900'>
        Oddaj swój głos
      </Text>
      <Text
        accessibilityLiveRegion='polite'
        className='font-cnt text-sm text-neutral-600'>
        {myVote === null
          ? 'Nie oddano jeszcze głosu.'
          : `Twój obecny wybór: ${myVote === 1 ? 'Za' : 'Przeciw'}.`}
      </Text>
      <View className='flex-row gap-3'>
        {OPTIONS.map((option) => {
          const selected = myVote === option.value;
          const pending = pendingVote === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onVote(option.value)}
              disabled={pendingVote !== null}
              accessibilityRole='button'
              accessibilityLabel={
                selected
                  ? `Twój głos: ${option.label}`
                  : `Głosuj ${option.label.toLowerCase()}`
              }
              accessibilityState={{
                disabled: pendingVote !== null,
                selected,
                busy: pending,
              }}
              className={`flex-1 items-center rounded-xl border px-4 py-3 ${selected ? option.selectedClassName : option.idleClassName}`}>
              <Text
                className={`font-cnt-bold text-base ${selected ? 'text-white' : option.idleTextClassName}`}>
                {pending ? 'Zapisywanie…' : option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text
          accessibilityRole='alert'
          className='font-cnt text-danger text-sm'>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
