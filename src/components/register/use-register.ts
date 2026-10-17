import { useState } from 'react';
import { router } from 'expo-router';
import { signUp } from '@/api';
import {
  RegisterErrors,
  RegisterForm,
  validateRegister,
} from '@/components/register/validate';

const EMPTY: RegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  areaId: null,
};

export function useRegister() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof RegisterForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function submit() {
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    setSubmitError(null);
    try {
      const email = form.email.trim();
      const { session } = await signUp({
        ...form,
        email,
        areaId: form.areaId!,
      });
      // przy włączonym potwierdzaniu e-maila Supabase nie zwraca sesji
      if (session) router.replace('/(tabs)');
      else router.replace({ pathname: '/(auth)/verify', params: { email } });
    } catch (e) {
      const fallback = 'Rejestracja nie powiodła się.';
      setSubmitError(e instanceof Error ? e.message : fallback);
    } finally {
      setLoading(false);
    }
  }

  return { form, set, errors, submitError, loading, submit };
}
