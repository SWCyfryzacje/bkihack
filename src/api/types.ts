import type { Database, Enums, Tables } from './database.types';

export type AreaLevel = Enums<'area_level'>;
export type Category = Enums<'proposal_category'>;
export type ProposalStatus = Enums<'proposal_status'>;

export type Area = Tables<'areas'>;
export type Profile = Tables<'profiles'>;
export type ProposalEvent = Tables<'proposal_events'>;

// Widok ma wszystkie kolumny nullable — w praktyce null mogą być tylko te dwie.
type ProposalRow = Tables<'proposals_with_counts'>;
type NullableKeys = 'agent_note' | 'threshold';
export type Proposal = {
  [K in Exclude<keyof ProposalRow, NullableKeys>]: NonNullable<ProposalRow[K]>;
} & Pick<ProposalRow, NullableKeys>;

export type VoteResult =
  Database['public']['Functions']['cast_vote']['Returns'][number];

export const CATEGORY_LABELS: Record<Category, string> = {
  general: 'Ogólna dla mieszkańców',
  city_task: 'Zadanie dla miasta',
  legislative: 'Inicjatywa uchwałodawcza',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  general: 'Pomysł lub apel skierowany do sąsiadów i społeczności.',
  city_task: 'Konkretna sprawa do załatwienia przez urząd miasta.',
  legislative: 'Propozycja nowej lub zmienionej uchwały Rady Miasta.',
};

export const LEVEL_LABELS: Record<AreaLevel, string> = {
  osiedle: 'Osiedle',
  okreg: 'Okręg',
  miasto: 'Miasto',
};
