import { fail, supabase } from './client';

export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  areaId: string;
};

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  areaId,
}: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // trigger handle_new_user tworzy z tego profil
    options: {
      data: { first_name: firstName, last_name: lastName, area_id: areaId },
    },
  });
  if (error) fail('Rejestracja nie powiodła się', error);
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) fail('Nieprawidłowy e-mail lub hasło', error);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) fail('Nie udało się wylogować', error);
}
