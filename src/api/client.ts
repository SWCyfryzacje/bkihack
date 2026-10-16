import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as untyped } from '@/utils/supabase';
import type { Database } from './database.types';

export const supabase = untyped as unknown as SupabaseClient<Database>;

// Supabase zwraca błędy jako obiekty — zamieniamy je na Error z polskim opisem.
export function fail(
  message: string,
  cause?: { message: string } | null
): never {
  throw new Error(cause ? `${message}: ${cause.message}` : message);
}
