import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SCOPES, type Voting } from '@/types/type';

type Props = {
  voting: Voting;
};

const SCOPE_ICONS: Record<
  Voting['scope'],
  ComponentProps<typeof Ionicons>['name']
> = {
  everyday: 'chatbubbles-outline',
  local: 'home-outline',
  citywide: 'business-outline',
};

const STAGE_AUDIENCE = {
  osiedle: 'osiedla',
  okreg: 'okręgu',
} as const;

function describeAudience({ scope, areaName, escalation }: Voting): string {
  if (escalation?.stage === 'miasto') {
    return 'Głosują wszyscy mieszkańcy miasta.';
  }
  if (escalation) {
    const next =
      escalation.stage === 'osiedle'
        ? 'okręg, a potem całe miasto'
        : 'całe miasto';
    return `Teraz widzą je i głosują tylko mieszkańcy ${STAGE_AUDIENCE[escalation.stage]} ${escalation.areaName}. Po spełnieniu progu obejmie ${next}.`;
  }
  if (scope === 'local' && areaName) {
    return `Widzą je i głosują tylko mieszkańcy osiedla ${areaName}.`;
  }
  if (scope === 'local') {
    return 'Głosowanie nie ma przypisanego osiedla, więc jest widoczne dla wszystkich.';
  }
  return 'Widoczne dla wszystkich mieszkańców, każdy może zagłosować.';
}

export default function VotingScopeCard({ voting }: Props) {
  const scopeLabel =
    SCOPES.find(({ value }) => value === voting.scope)?.label ?? voting.scope;

  return (
    <View className='bg-surface gap-3 rounded-2xl border border-neutral-200 p-5'>
      <Text className='font-hd-bold text-xl text-neutral-900'>
        Zasięg głosowania
      </Text>
      <View className='flex-row items-center gap-3'>
        <View className='bg-primary-50 h-10 w-10 items-center justify-center rounded-full'>
          <Ionicons
            name={SCOPE_ICONS[voting.scope]}
            className='text-primary-600 text-xl'
          />
        </View>
        <View className='flex-1'>
          <Text className='font-cnt-bold text-base text-neutral-900'>
            {scopeLabel}
          </Text>
          {voting.areaName ? (
            <Text className='font-cnt text-sm text-neutral-600'>
              {voting.areaName}
            </Text>
          ) : null}
        </View>
      </View>
      <Text className='font-cnt text-sm leading-5 text-neutral-700'>
        {describeAudience(voting)}
      </Text>
      {voting.eligibleVoters !== null ? (
        <Text className='font-cnt text-xs text-neutral-500'>
          Uprawnieni do głosowania: {voting.eligibleVoters}
        </Text>
      ) : null}
    </View>
  );
}
