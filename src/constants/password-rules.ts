// Musi zgadzać się z Clerk Dashboard → User & authentication → Password.
// Clerk dodatkowo odrzuca hasła z wycieków (HIBP) — tego nie sprawdzimy lokalnie.
export const PASSWORD_MIN_LENGTH = 15;

export type PasswordRule = {
  label: (password: string) => string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    label: (password) =>
      password.length >= PASSWORD_MIN_LENGTH
        ? `Co najmniej ${PASSWORD_MIN_LENGTH} znaków`
        : `Co najmniej ${PASSWORD_MIN_LENGTH} znaków (${password.length}/${PASSWORD_MIN_LENGTH})`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
];

export const PASSWORD_BREACH_HINT =
  'Nie może być hasłem, które wyciekło w sieci';
