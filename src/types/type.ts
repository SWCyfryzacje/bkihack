import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type Voting = {
  id: string;
  title: string;
  description: string;
  category:
    | 'transport'
    | 'greenery'
    | 'safety'
    | 'cleanliness'
    | 'noise'
    | 'housing'
    | 'services'
    | 'culture'
    | 'community'
    | 'other';
  scope: 'everyday' | 'local' | 'citywide';
  isAnonymous: boolean;
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

export type CategoryValue = (typeof CATEGORIES)[number]['value'];
export type ScopeValue = (typeof SCOPES)[number]['value'];
type IconName = ComponentProps<typeof Ionicons>['name'];
