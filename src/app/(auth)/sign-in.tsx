import { useState } from 'react';
import { router } from 'expo-router';
import { EmailNotConfirmedError, signIn } from '@/api';
import FormScreen from '@/components/form/form-screen';
import AuthHeader from '@/components/form/auth-header';
import AuthLink from '@/components/form/auth-link';
import FormError from '@/components/form/form-error';
import PrimaryButton from '@/components/form/primary-button';
import CredentialsFields from '@/components/register/credentials-fields';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: 'email' | 'password', value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function submit() {
    if (!form.email.trim() || !form.password) {
      setError('Podaj e-mail i hasło.');
      return;
    }
    setLoading(true);
    setError(null);
    const email = form.email.trim();
    try {
      await signIn(email, form.password);
      router.replace('/(tabs)');
    } catch (e) {
      // konto bez potwierdzenia — dosyłamy kod i przechodzimy do jego wpisania
      if (e instanceof EmailNotConfirmedError) {
        router.push({
          pathname: '/(auth)/verify',
          params: { email, resend: '1' },
        });
        return;
      }
      setError(e instanceof Error ? e.message : 'Logowanie nie powiodło się.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormScreen>
      <AuthHeader
        title='Witaj ponownie'
        subtitle='Zaloguj się, aby zobaczyć sprawy z Twojej okolicy.'
      />
      <FormError message={error} />
      <CredentialsFields
        {...form}
        onChange={set}
        errors={{}}
      />
      <PrimaryButton
        title='Zaloguj się'
        onPress={submit}
        loading={loading}
      />
      <AuthLink
        prompt='Nie masz konta?'
        label='Zarejestruj się'
        href='/(auth)/sign-up'
      />
    </FormScreen>
  );
}
