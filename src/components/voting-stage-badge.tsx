import { Text, View } from 'react-native';
import { VOTING_STAGES, VOTING_STATUS_LABELS } from '@/constants/voting-stages';
import type { Voting } from '@/types/type';

type Props = {
  voting: Pick<Voting, 'status' | 'escalation'>;
};

const STATUS_STYLES = {
  open: { badge: 'bg-primary-50', text: 'text-primary-700' },
  passed: { badge: 'bg-success-light', text: 'text-success' },
  rejected: { badge: 'bg-danger-light', text: 'text-danger' },
} as const;

export default function VotingStageBadge({ voting }: Props) {
  if (!voting.escalation) return null;

  const styles = STATUS_STYLES[voting.status];
  const label =
    voting.status === 'open'
      ? `Etap: ${
          VOTING_STAGES.find(({ value }) => value === voting.escalation?.stage)
            ?.label ?? voting.escalation.stage
        }`
      : VOTING_STATUS_LABELS[voting.status];

  return (
    <View className={`rounded-full px-3 py-1 ${styles.badge}`}>
      <Text className={`font-cnt-bold text-xs ${styles.text}`}>{label}</Text>
    </View>
  );
}
