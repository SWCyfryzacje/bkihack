import { ProcessedErrors } from '@/types/type';

type ClerkMessage = { message: string; longMessage?: string };

type ClerkErrors = {
  fields: object;
  global: ClerkMessage[] | null;
};

// Clerk zwraca błędy pod własnymi nazwami pól (emailAddress, identifier, code...),
// a formularze pokazują je pod email / password / code.
const FIELD_KEYS: Record<string, keyof ProcessedErrors> = {
  emailAddress: 'email',
  identifier: 'email',
  password: 'password',
  code: 'code',
};

const toMessage = (error: ClerkMessage) => error.longMessage ?? error.message;

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
    }
  );

  if (global?.length) processed.global ??= toMessage(global[0]);

  return processed;
}
