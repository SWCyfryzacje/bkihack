import { fail, supabase } from './client';

export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  areaId: string;
};

// Konto istnieje, ale e-mail nie został jeszcze potwierdzony kodem.
export class EmailNotConfirmedError extends Error {
  constructor() {
    super('Potwierdź adres e-mail kodem z wiadomości.');
  }
}

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

// szablon "Confirm signup" w Supabase musi wysyłać {{ .Token }}, nie link
export async function verifySignUpCode(email: string, code: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'signup',
  });
  if (error) fail('Nieprawidłowy lub wygasły kod', error);
  return data;
}

export async function resendSignUpCode(email: string) {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) fail('Nie udało się wysłać kodu ponownie', error);
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error?.code === 'email_not_confirmed') throw new EmailNotConfirmedError();
  if (error) fail('Nieprawidłowy e-mail lub hasło', error);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) fail('Nie udało się wylogować', error);
}
