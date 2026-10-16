export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  areaId: string | null;
};

export type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!form.firstName.trim()) errors.firstName = 'Podaj imię.';
  if (!form.lastName.trim()) errors.lastName = 'Podaj nazwisko.';
  if (!EMAIL_RE.test(form.email.trim()))
    errors.email = 'Podaj poprawny adres e-mail.';
  if (form.password.length < 6)
    errors.password = 'Hasło musi mieć co najmniej 6 znaków.';
  if (!form.areaId) errors.areaId = 'Wybierz swoje osiedle.';

  return errors;
}
