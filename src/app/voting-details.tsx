import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import SafeView from '@/components/safe-view';
import VotingActions from '@/components/voting-actions';
import VotingScopeCard from '@/components/voting-scope-card';
import VotingStageCard from '@/components/voting-stage-card';
import {
  castVotingVote,
  fetchVotingById,
} from '@/repositories/voting-repository';
import {
  CATEGORIES,
  SCOPES,
  type Voting,
  type VotingVoteValue,
} from '@/types/type';
import { Ionicons } from '@expo/vector-icons';

const OUTCOME_STYLES = {
  success: {
    card: 'border-success/20 bg-success-light',
    text: 'text-success',
  },
  danger: {
    card: 'border-danger/20 bg-danger-light',
    text: 'text-danger',
  },
} as const;

const OUTCOMES = [
  { label: 'Za', count: 'votesFor', tone: 'success' },
  { label: 'Przeciw', count: 'votesAgainst', tone: 'danger' },
] as const;

export default function VotingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const [voting, setVoting] = useState<Voting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [pendingVote, setPendingVote] = useState<VotingVoteValue | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const votePendingRef = useRef(false);

  useEffect(() => {
    let active = true;

    void Promise.resolve()
      .then(() => {
        if (!id) throw new Error('Brak identyfikatora głosowania.');
        return fetchVotingById(id);
      })
      .then((record) => {
        if (active) setVoting(record);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setVoting(null);
        setError(
          caught instanceof Error
            ? caught.message
            : 'Nie udało się pobrać szczegółów głosowania.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, retryKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryKey((current) => current + 1);
  };

  const handleVote = async (value: VotingVoteValue) => {
    if (!voting || votePendingRef.current || voting.myVote === value) return;

    if (!isSignedIn) {
      Alert.alert(
        'Zaloguj się, aby głosować',
        'Aby oddać głos, zaloguj się na swoje konto.',
        [
          { text: 'Anuluj', style: 'cancel' },
          {
            text: 'Zaloguj się',
            onPress: () => router.push('/(auth)/sign-in'),
          },
        ]
      );
      return;
    }

    votePendingRef.current = true;
    setPendingVote(value);
    setVoteError(null);

    try {
      setVoting(await castVotingVote(voting.id, value));
    } catch (caught: unknown) {
      setVoteError(
        caught instanceof Error
          ? caught.message
          : 'Nie udało się zapisać głosu. Spróbuj ponownie.'
      );
    } finally {
      votePendingRef.current = false;
      setPendingVote(null);
    }
  };

  const categoryLabel = CATEGORIES.find(
    ({ value }) => value === voting?.category
  )?.label;
  const scopeLabel = SCOPES.find(({ value }) => value === voting?.scope)?.label;

  return (
    <SafeView className='bg-canvas flex-1'>
      <View className='flex-row items-center gap-3 px-6 pt-4 pb-3'>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole='button'
          accessibilityLabel='Wróć'
          className='bg-surface h-10 w-10 items-center justify-center rounded-full border border-neutral-200'>
          <Ionicons
            name='arrow-back'
            className='text-primary-600 text-4xl'
          />
        </Pressable>
        <Text className='font-hd-bold text-xl text-neutral-900'>
          Szczegóły głosowania
        </Text>
      </View>

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <Text className='font-cnt text-base text-neutral-600'>
            Ładowanie szczegółów…
          </Text>
        </View>
      ) : error || !voting ? (
        <View className='flex-1 items-center justify-center gap-4 px-6'>
          <Text className='font-cnt text-danger text-center text-base'>
            {error ?? 'Nie udało się znaleźć głosowania.'}
          </Text>
          <Pressable
            onPress={handleRetry}
            accessibilityRole='button'
            className='bg-accent-500 active:bg-accent-600 rounded-xl px-5 py-3'>
            <Text className='font-cnt-bold text-base text-white'>
              Spróbuj ponownie
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className='flex-1'
          contentContainerClassName='gap-5 px-6 pb-8 pt-3'>
          <View className='bg-surface gap-3 rounded-2xl border border-neutral-200 p-5'>
            <View className='flex-row flex-wrap gap-2'>
              <Text className='bg-primary-50 font-cnt-bold text-primary-700 rounded-full px-3 py-1 text-xs'>
                {categoryLabel ?? voting.category}
              </Text>
              <Text className='font-cnt-bold rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700'>
                {scopeLabel ?? voting.scope}
                {voting.areaName && !voting.escalation
                  ? ` · ${voting.areaName}`
                  : ''}
              </Text>
            </View>
            <Text className='font-hd-bold text-2xl text-neutral-900'>
              {voting.title}
            </Text>
            <Text className='font-cnt text-base leading-6 text-neutral-700'>
              {voting.description}
            </Text>
            {voting.isAnonymous || voting.authorName ? (
              <View className='flex-row items-center gap-2'>
                <Ionicons
                  name='person-circle-outline'
                  className='text-xl text-neutral-500'
                />
                <Text className='font-cnt text-sm text-neutral-600'>
                  {voting.isAnonymous
                    ? 'Utworzone anonimowo'
                    : `Utworzone przez: ${voting.authorName}`}
                </Text>
              </View>
            ) : null}
          </View>

          <VotingScopeCard voting={voting} />

          <View className='gap-3'>
            <Text className='font-hd-bold text-xl text-neutral-900'>
              Głosy mieszkańców
            </Text>
            <View className='flex-row gap-3'>
              {OUTCOMES.map((outcome) => {
                const styles = OUTCOME_STYLES[outcome.tone];
                return (
                  <View
                    key={outcome.count}
                    className={`flex-1 items-center gap-1 rounded-2xl border p-4 ${styles.card}`}>
                    <Text className={`font-cnt-bold text-sm ${styles.text}`}>
                      {outcome.label}
                    </Text>
                    <Text className={`font-hd-bold text-3xl ${styles.text}`}>
                      {voting[outcome.count]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {voting.escalation ? (
            <VotingStageCard
              escalation={voting.escalation}
              status={voting.status}
            />
          ) : null}

          {voting.status === 'open' ? (
            <VotingActions
              myVote={voting.myVote}
              pendingVote={pendingVote}
              error={voteError}
              onVote={handleVote}
            />
          ) : null}
        </ScrollView>
      )}
    </SafeView>
  );
}
