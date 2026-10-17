import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type VotingListEmptyStateProps = {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function VotingListEmptyState({
  loading,
  error,
  onRetry,
}: VotingListEmptyStateProps) {
  if (loading) return <ActivityIndicator className='mt-8' />;

  if (error) {
    return (
      <View className='items-center gap-3 py-8'>
        <Text className='text-center text-neutral-700'>
          Nie udało się pobrać głosowań: {error}
        </Text>
        <Pressable onPress={onRetry} accessibilityRole='button'>
          <Text className='font-sans-semibold text-primary-700'>Spróbuj ponownie</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Text className='py-8 text-center text-neutral-700'>
      Brak aktywnych głosowań.
    </Text>
  );
}