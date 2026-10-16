import { fail, supabase } from './client';
import type { Area, AreaLevel } from './types';

export async function fetchAreas(level?: AreaLevel): Promise<Area[]> {
  let query = supabase.from('areas').select('*').order('name');
  if (level) query = query.eq('level', level);

  const { data, error } = await query;
  if (error) fail('Nie udało się pobrać obszarów', error);
  return data;
}
