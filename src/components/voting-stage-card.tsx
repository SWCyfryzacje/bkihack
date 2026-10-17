import { Fragment } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import { VOTING_STAGES } from '@/constants/voting-stages';
import type { VotingEscalation, VotingStatus } from '@/types/type';

type Props = {
  escalation: VotingEscalation;
  status: VotingStatus;
};

function percent(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : '–';
}

function describeOutcome(
  { stage, threshold }: VotingEscalation,
  status: VotingStatus,
  stageTitle: string
): string {
  if (status === 'passed') {
    return 'Głosowanie zakończone. Mieszkańcy poparli propozycję.';
  }
  if (status === 'rejected') {
    return stage === 'miasto'
      ? 'Głosowanie zakończone. Przeważyły głosy przeciw.'
      : `Propozycja nie uzyskała wymaganego poparcia (${stageTitle.toLowerCase()}).`;
  }
  if (threshold === null) {
    return 'To ostatni etap. Wynik zapadnie po jego zakończeniu.';
  }

  const value = Math.round(threshold * 100);
  return `Przejdzie dalej po zakończeniu etapu przy co najmniej ${value}% głosów za, albo od razu przy frekwencji ${value}% i ponad ${value}% głosów za.`;
}

export default function VotingStageCard({ escalation, status }: Props) {
  const currentIndex = VOTING_STAGES.findIndex(
    ({ value }) => value === escalation.stage
  );
  const current = VOTING_STAGES[currentIndex];
  const stageTitle = current?.title ?? escalation.stage;
  const cast = escalation.votesFor + escalation.votesAgainst;
  const endsAt = dayjs(escalation.endsAt).locale('pl').format('D MMMM, HH:mm');

  return (
    <View className='bg-surface gap-4 rounded-2xl border border-neutral-200 p-5'>
      <Text className='font-hd-bold text-xl text-neutral-900'>
        Etapy głosowania
      </Text>

      <View className='flex-row items-center gap-1'>
        {VOTING_STAGES.map((stage, index) => {
          const active = index === currentIndex;
          const done = index < currentIndex;
          const pillClassName = active
            ? status === 'rejected'
              ? 'bg-danger'
              : 'bg-primary-500'
            : done
              ? 'bg-success-light'
              : 'bg-neutral-100';
          const textClassName = active
            ? 'text-white'
            : done
              ? 'text-success'
              : 'text-neutral-500';

          return (
            <Fragment key={stage.value}>
              {index > 0 ? (
                <Ionicons
                  name='chevron-forward'
                  className='text-base text-neutral-400'
                />
              ) : null}
              <View
                accessibilityState={{ selected: active }}
                className={`flex-1 items-center rounded-full px-2 py-1.5 ${pillClassName}`}>
                <Text className={`font-cnt-bold text-xs ${textClassName}`}>
                  {stage.label}
                </Text>
              </View>
            </Fragment>
          );
        })}
      </View>

      <View className='gap-1'>
        <Text className='font-cnt-bold text-base text-neutral-900'>
          {stageTitle} · {escalation.areaName}
        </Text>
        {status === 'open' ? (
          <Text className='font-cnt text-sm text-neutral-600'>
            Koniec etapu: {endsAt}
          </Text>
        ) : null}
      </View>

      <View className='flex-row gap-3'>
        <View className='flex-1 gap-1 rounded-xl bg-neutral-50 p-3'>
          <Text className='font-cnt text-xs text-neutral-600'>Frekwencja</Text>
          <Text className='font-hd-bold text-lg text-neutral-900'>
            {percent(escalation.voters, escalation.eligible)}
          </Text>
          <Text className='font-cnt text-xs text-neutral-500'>
            {escalation.voters} z {escalation.eligible} mieszkańców
          </Text>
        </View>
        <View className='flex-1 gap-1 rounded-xl bg-neutral-50 p-3'>
          <Text className='font-cnt text-xs text-neutral-600'>Głosy za</Text>
          <Text className='font-hd-bold text-lg text-neutral-900'>
            {percent(escalation.votesFor, cast)}
          </Text>
          <Text className='font-cnt text-xs text-neutral-500'>
            {escalation.votesFor} z {cast} głosów
          </Text>
        </View>
      </View>

      <Text
        accessibilityLiveRegion='polite'
        className={`font-cnt text-sm ${
          status === 'passed'
            ? 'text-success'
            : status === 'rejected'
              ? 'text-danger'
              : 'text-neutral-600'
        }`}>
        {describeOutcome(escalation, status, stageTitle)}
      </Text>
    </View>
  );
}
