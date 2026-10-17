import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import {
  CATEGORIES,
  SCOPES,
  VOTING_MECHANISMS,
  type Voting,
} from '@/types/type';
import type { ReportFormData } from '@/types/zod-types';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type VotingRow = Database['public']['Tables']['votings']['Row'];
export type VotingChange =
  | { event: 'INSERT' | 'UPDATE'; voting: Voting }
  | { event: 'DELETE'; id: string };

const categoryValues = new Set<string>(CATEGORIES.map(({ value }) => value));
const scopeValues = new Set<string>(SCOPES.map(({ value }) => value));
const mechanismValues = new Set<string>(
  VOTING_MECHANISMS.map(({ value }) => value)
);

function mapVotingRow(row: VotingRow): Voting {
  if (
    !categoryValues.has(row.category) ||
    !scopeValues.has(row.scope) ||
    !mechanismValues.has(row.mechanism)
  ) {
    throw new Error(
      `Voting ${row.id} contains an unsupported category, scope, or mechanism.`
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

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    scope: row.scope,
    isAnonymous: row.is_anonymous,
    votesFor: row.votes_for,
    votesAgainst: row.votes_against,
    mechanism: row.mechanism,
  };
}

function throwOnError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export async function fetchVotings(): Promise<Voting[]> {
  const { data, error } = await supabase
    .from('votings')
    .select('*')
    .order('created_at', { ascending: false });

  throwOnError(error);
  if (!data) throw new Error('Supabase returned no voting records.');
  return data.map(mapVotingRow);
}

export async function fetchVotingById(id: string): Promise<Voting> {
  const { data, error } = await supabase
    .from('votings')
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
    .select('*')
    .single();

  throwOnError(error);
  if (!row) throw new Error('Supabase did not return the inserted voting.');
  return mapVotingRow(row);
}

export function subscribeToVotings(
  onChange: (change: VotingChange) => void
): () => void {
  const channel = supabase
    .channel('public:votings')
    .on<Database['public']['Tables']['votings']['Row']>(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'votings' },
      (payload: RealtimePostgresChangesPayload<VotingRow>) => {
        if (payload.eventType === 'DELETE') {
          const id = (payload.old as Partial<VotingRow>).id;
          if (id) onChange({ event: 'DELETE', id });
          return;
        }

        onChange({
          event: payload.eventType,
          voting: mapVotingRow(payload.new),
        });
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
