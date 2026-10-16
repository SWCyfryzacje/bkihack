import { fail, supabase } from './client';
import type { Profile } from './types';

export async function getMyUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function fetchMyProfile(): Promise<Profile | null> {
  const userId = await getMyUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) fail('Nie udało się pobrać profilu', error);
  return data;
}
