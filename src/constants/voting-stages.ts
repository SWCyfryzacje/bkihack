import type { VotingStage, VotingStatus } from '@/types/type';

// Kolejność etapów skalowania głosowania "Całe miasto"
export const VOTING_STAGES = [
  { value: 'osiedle', label: 'Lokalne', title: 'Głosowanie lokalne' },
  { value: 'okreg', label: 'Regionalne', title: 'Głosowanie regionalne' },
  { value: 'miasto', label: 'Miejskie', title: 'Głosowanie miejskie' },
] as const satisfies readonly {
  value: VotingStage;
  label: string;
  title: string;
}[];

export const VOTING_STATUS_LABELS: Record<VotingStatus, string> = {
  open: 'Trwa',
  passed: 'Przyjęte',
  rejected: 'Odrzucone',
};
