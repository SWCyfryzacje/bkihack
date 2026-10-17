import { ProcessedErrors } from '@/types/type';
import { PASSWORD_MIN_LENGTH } from '@/constants/password-rules';

type ClerkMessage = { code: string; message: string; longMessage?: string };

type ClerkErrors = {
  fields: object;
  global: ClerkMessage[] | null;
};

// Clerk zwraca błędy pod własnymi nazwami pól (emailAddress, identifier, code...),
// a formularze pokazują je pod email / password / code.
type MessageKey = Exclude<keyof ProcessedErrors, 'passwordBreached'>;

const FIELD_KEYS: Record<string, MessageKey> = {
  emailAddress: 'email',
  identifier: 'email',
  password: 'password',
  code: 'code',
};

const PASSWORD_PWNED = 'form_password_pwned';

// Polskie komunikaty dla najczęstszych kodów; reszta leci po angielsku z Clerka
const MESSAGES: Record<string, string> = {
  [PASSWORD_PWNED]:
    'To hasło pojawiło się w wycieku danych w sieci. Wybierz inne hasło.',
  form_password_length_too_short: `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków.`,
  form_password_not_strong_enough: 'Hasło jest za słabe. Wybierz silniejsze.',
  form_password_incorrect: 'Nieprawidłowe hasło.',
  form_identifier_exists: 'Konto z tym adresem e-mail już istnieje.',
  form_identifier_not_found: 'Nie znaleziono konta z tym adresem e-mail.',
  form_code_incorrect: 'Nieprawidłowy kod.',
};

const toMessage = (error: ClerkMessage) =>
  MESSAGES[error.code] ?? error.longMessage ?? error.message;

export function processClerkErrors({
  fields,
  global,
}: ClerkErrors): ProcessedErrors {
  const processed: ProcessedErrors = {};

  Object.entries(fields as Record<string, ClerkMessage | null>).forEach(
    ([key, error]) => {
      if (!error) return;

      const target = FIELD_KEYS[key] ?? 'global';
      processed[target] ??= toMessage(error);

      if (error.code === PASSWORD_PWNED) processed.passwordBreached = true;
    }
  );

  if (global?.length) processed.global ??= toMessage(global[0]);

  return processed;
}
