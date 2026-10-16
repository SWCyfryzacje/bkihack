import { fail, supabase } from './client';
import { getMyUserId } from './profile';
import type { VoteResult } from './types';

export type VoteValue = 1 | -1;

// Upsert głosu; wynik mówi też, czy propozycja właśnie awansowała.
export async function castVote(
  proposalId: string,
  value: VoteValue = 1
): Promise<VoteResult> {
  const { data, error } = await supabase.rpc('cast_vote', {
    p_proposal_id: proposalId,
    p_value: value,
  });
  if (error) fail('Nie udało się oddać głosu', error);
  if (!data?.[0]) fail('Nie znaleziono propozycji');
  return data[0];
}

export async function removeVote(proposalId: string): Promise<void> {
  const userId = await getMyUserId();
  if (!userId) fail('Musisz być zalogowany');

  const { error } = await supabase
    .from('votes')
    .delete()
    .eq('proposal_id', proposalId)
    .eq('user_id', userId);
  if (error) fail('Nie udało się cofnąć głosu', error);
}

// Mapa proposalId -> 1 | -1 dla zalogowanego użytkownika.
export async function fetchMyVotes(): Promise<Record<string, VoteValue>> {
  const userId = await getMyUserId();
  if (!userId) return {};

  const { data, error } = await supabase
    .from('votes')
    .select('proposal_id, value')
    .eq('user_id', userId);
  if (error) fail('Nie udało się pobrać głosów', error);
  return Object.fromEntries(
    data.map((v) => [v.proposal_id, v.value as VoteValue])
  );
}
