import {
  CATEGORIES,
  SCOPES,
  type Voting,
  type VotingEscalation,
  type VotingVoteValue,
} from '@/types/type';
import type { ReportFormData } from '@/types/zod-types';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type VotingRow = Database['public']['Views']['votings_with_counts']['Row'];

const categoryValues = new Set<string>(CATEGORIES.map(({ value }) => value));
const scopeValues = new Set<string>(SCOPES.map(({ value }) => value));

function mapEscalation(row: VotingRow): VotingEscalation | null {
  if (row.stage === null) return null;
  if (!row.stage_area_name || !row.stage_ends_at) {
    throw new Error(`Voting ${row.id} contains an incomplete stage.`);
  }

  return {
    stage: row.stage,
    areaName: row.stage_area_name,
    endsAt: row.stage_ends_at,
    threshold: row.stage_threshold,
    eligible: row.stage_eligible ?? 0,
    voters: row.stage_voters ?? 0,
    votesFor: row.stage_votes_for ?? 0,
    votesAgainst: row.stage_votes_against ?? 0,
  };
}

function mapVotingRow(row: VotingRow): Voting {
  if (!categoryValues.has(row.category) || !scopeValues.has(row.scope)) {
    throw new Error(
      `Voting ${row.id} contains an unsupported category or scope.`
    );
  }
  if (
    !Number.isInteger(row.votes_for) ||
    row.votes_for < 0 ||
    !Number.isInteger(row.votes_against) ||
    row.votes_against < 0
  ) {
    throw new Error(`Voting ${row.id} contains invalid vote totals.`);
  }
  if (row.my_vote !== null && row.my_vote !== 1 && row.my_vote !== -1) {
    throw new Error(`Voting ${row.id} contains an invalid current vote.`);
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    scope: row.scope,
    isAnonymous: row.is_anonymous,
    votesFor: row.votes_for,
    votesAgainst: row.votes_against,
    myVote: row.my_vote,
    areaName: row.stage_area_name,
    eligibleVoters: row.stage_area_name ? (row.stage_eligible ?? 0) : null,
    authorName: row.author_name,
    status: row.status,
    escalation: mapEscalation(row),
  };
}

function throwOnError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

// Domyka etapy, którym minął termin (baza nie ma harmonogramu zadań).
async function advanceVotings(): Promise<void> {
  const { error } = await supabase.rpc('advance_votings');
  throwOnError(error);
}

export async function fetchVotings(): Promise<Voting[]> {
  await advanceVotings();
  const { data, error } = await supabase
    .from('votings_with_counts')
    .select('*')
    .order('created_at', { ascending: false });

  throwOnError(error);
  if (!data) throw new Error('Supabase returned no voting records.');
  return data.map(mapVotingRow);
}

export async function fetchVotingById(id: string): Promise<Voting> {
  await advanceVotings();
  const { data, error } = await supabase
    .from('votings_with_counts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  throwOnError(error);
  if (!data) throw new Error('Nie znaleziono głosowania.');
  return mapVotingRow(data);
}

export async function insertVoting(data: ReportFormData): Promise<Voting> {
  const { data: row, error } = await supabase
    .from('votings')
    .insert({
      title: data.title,
      description: data.description,
      category: data.category,
      scope: data.scope,
      is_anonymous: data.isAnonymous,
    })
    .select('id')
    .single();

  throwOnError(error);
  if (!row) throw new Error('Supabase did not return the inserted voting.');
  return fetchVotingById(row.id);
}

export async function castVotingVote(
  votingId: string,
  value: VotingVoteValue
): Promise<Voting> {
  const { error } = await supabase.rpc('cast_voting_vote', {
    p_voting_id: votingId,
    p_value: value,
  });

  throwOnError(error);
  return fetchVotingById(votingId);
}

export function subscribeToVotings(onChange: () => void): () => void {
  const channel = supabase
    .channel('public:votings')
    .on<Database['public']['Tables']['votings']['Row']>(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'votings' },
      onChange
    )
    .on<Database['public']['Tables']['voting_votes']['Row']>(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'voting_votes' },
      onChange
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
