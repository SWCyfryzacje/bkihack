import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { getClerkInstance } from '@clerk/expo';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to connect to Supabase.'
  );
}

// Supabase ufa tokenom Clerka (third-party auth), więc zalogowany użytkownik ma rolę `authenticated`.
// Bez sesji Clerka zwracamy null i zapytania idą jako `anon`.
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  accessToken: async () => (await getClerkInstance()?.session?.getToken()) ?? null,
});
