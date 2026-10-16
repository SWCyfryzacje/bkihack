import { fail, supabase } from './client';
import { getMyUserId } from './profile';
import type { AreaLevel, Category, Proposal } from './types';

export type ProposalFilter = { areaId?: string; scope?: AreaLevel };

export type NewProposal = {
  title: string;
  body: string;
  category: Category;
  areaId: string;
};

export async function fetchProposals(
  filter: ProposalFilter = {}
): Promise<Proposal[]> {
  let query = supabase
    .from('proposals_with_counts')
    .select('*')
    .order('created_at', { ascending: false });
  if (filter.areaId) query = query.eq('area_id', filter.areaId);
  if (filter.scope) query = query.eq('scope', filter.scope);

  const { data, error } = await query;
  if (error) fail('Nie udało się pobrać propozycji', error);
  return data as Proposal[];
}

export async function fetchProposal(id: string): Promise<Proposal | null> {
  const { data, error } = await supabase
    .from('proposals_with_counts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) fail('Nie udało się pobrać propozycji', error);
  return data as Proposal | null;
}

export async function createProposal(input: NewProposal): Promise<Proposal> {
  const authorId = await getMyUserId();
  if (!authorId) fail('Musisz być zalogowany, aby dodać propozycję');

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      title: input.title,
      body: input.body,
      category: input.category,
      area_id: input.areaId,
      author_id: authorId,
    })
    .select('id')
    .single();
  if (error) fail('Nie udało się dodać propozycji', error);

  const created = await fetchProposal(data.id);
  if (!created) fail('Propozycja dodana, ale nie udało się jej odczytać');
  return created;
}
