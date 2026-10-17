import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof Ionicons>['name'];
type VoteCountField = 'votesFor' | 'votesAgainst';
type VotingMechanismDefinition = {
  label: string;
  outcomes: readonly {
    label: string;
    count: VoteCountField;
    tone: 'success' | 'danger';
  }[];
};

// `as const` keeps literal types, `satisfies` checks the shape (and icon names!) without widening
export const CATEGORIES = [
  { value: 'transport', label: 'Transport i drogi', icon: 'bus-outline' },
  { value: 'greenery', label: 'Parki i zieleń', icon: 'leaf-outline' },
  {
    value: 'safety',
    label: 'Bezpieczeństwo',
    icon: 'shield-checkmark-outline',
  },
  { value: 'cleanliness', label: 'Czystość i odpady', icon: 'trash-outline' },
  { value: 'noise', label: 'Hałas', icon: 'volume-mute-outline' },
  { value: 'housing', label: 'Przestrzeń publiczna', icon: 'business-outline' },
  { value: 'services', label: 'Usługi publiczne', icon: 'medkit-outline' },
  {
    value: 'culture',
    label: 'Kultura i wydarzenia',
    icon: 'musical-notes-outline',
  },
  { value: 'community', label: 'Życie sąsiedzkie', icon: 'people-outline' },
  { value: 'other', label: 'Inne', icon: 'ellipsis-horizontal-circle-outline' },
] as const satisfies readonly {
  value: string;
  label: string;
  icon: IconName;
}[];

export const SCOPES = [
  { value: 'everyday', label: 'Sprawa codzienna' },
  { value: 'local', label: 'Moja okolica' },
  { value: 'citywide', label: 'Całe miasto' },
] as const satisfies readonly { value: string; label: string }[];

export const VOTING_MECHANISMS = [
  {
    value: 'for_against',
    label: 'Za / przeciw',
    outcomes: [
      { label: 'Za', count: 'votesFor', tone: 'success' },
      { label: 'Przeciw', count: 'votesAgainst', tone: 'danger' },
    ],
  },
] as const satisfies readonly (VotingMechanismDefinition & { value: string })[];

export type CategoryValue = (typeof CATEGORIES)[number]['value'];
export type ScopeValue = (typeof SCOPES)[number]['value'];
export type VotingMechanismValue = (typeof VOTING_MECHANISMS)[number]['value'];

export type Voting = {
  id: string;
  title: string;
  description: string;
  category: CategoryValue;
  scope: ScopeValue;
  isAnonymous: boolean;
  votesFor: number;
  votesAgainst: number;
  mechanism: VotingMechanismValue;
};

export type ProcessedErrors = {
  email?: string;
  password?: string;
  code?: string;
};
