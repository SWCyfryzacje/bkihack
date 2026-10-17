export const FormFeatures = [
  { value: 'transport', label: 'Transport i drogi', icon: 'bus-outline' },
  { value: 'greenery', label: 'Parki i zieleń', icon: 'leaf-outline' },
  {
    value: 'safety',
    label: 'Bezpieczeństwo i oświetlenie',
    icon: 'shield-checkmark-outline',
  },
  { value: 'cleanliness', label: 'Czystość i odpady', icon: 'trash-outline' },
  {
    value: 'noise',
    label: 'Hałas i uciążliwości',
    icon: 'volume-mute-outline',
  },
  {
    value: 'housing',
    label: 'Zabudowa i przestrzeń publiczna',
    icon: 'business-outline',
  },
  { value: 'services', label: 'Usługi publiczne', icon: 'medkit-outline' },
  {
    value: 'culture',
    label: 'Kultura i wydarzenia',
    icon: 'musical-notes-outline',
  },
  { value: 'community', label: 'Życie sąsiedzkie', icon: 'people-outline' },
  { value: 'other', label: 'Inne', icon: 'ellipsis-horizontal-circle-outline' },
] as const;

export const SCOPES = [
  { value: 'everyday', label: 'Sprawa codzienna' },
  { value: 'local', label: 'Moja okolica' },
  { value: 'citywide', label: 'Całe miasto' },
] as const;

export const DURATIONS = [3, 7, 14, 30] as const;
