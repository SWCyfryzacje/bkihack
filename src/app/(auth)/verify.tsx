import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { resendSignUpCode, verifySignUpCode } from '@/api';
import FormScreen from '@/components/form/form-screen';
import AuthHeader from '@/components/form/auth-header';
import AuthLink from '@/components/form/auth-link';
import FormError from '@/components/form/form-error';
import FormInfo from '@/components/form/form-info';
import PrimaryButton from '@/components/form/primary-button';
import TextField from '@/components/form/text-field';

const CODE_RE = /^\d{6,10}$/;

export default function Verify() {
  const { email = '', resend } = useLocalSearchParams<{
    email: string;
    resend?: string;
  }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  async function sendAgain() {
    setSending(true);
    setError(null);
    try {
      await resendSignUpCode(email);
      setInfo(`Wysłaliśmy nowy kod na ${email}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nie udało się wysłać kodu.');
    } finally {
      setSending(false);
    }
  }

  // z ekranu logowania: stary kod mógł wygasnąć, więc wysyłamy świeży
  useEffect(() => {
    if (resend && email) sendAgain();
  }, []);

  async function submit() {
    const token = code.trim();
    if (!CODE_RE.test(token)) {
      setError('Wpisz kod z wiadomości e-mail.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifySignUpCode(email, token);
      router.replace('/(tabs)');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Weryfikacja nie powiodła się.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormScreen>
      <AuthHeader
        title='Potwierdź e-mail'
        subtitle={`Wpisz kod, który wysłaliśmy na ${email}.`}
      />
      <FormError message={error} />
      <FormInfo message={info} />
      <TextField
        label='Kod'
        placeholder='123456'
        keyboardType='number-pad'
        autoComplete='one-time-code'
        textContentType='oneTimeCode'
        maxLength={10}
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, ''))}
      />
      <PrimaryButton
        title='Potwierdź'
        onPress={submit}
        loading={loading}
      />
      <Pressable
        onPress={sendAgain}
        disabled={sending}
        className='mt-2 items-center py-2'>
        <Text className='font-cnt-bold text-primary-600 text-sm'>
          {sending ? 'Wysyłanie…' : 'Wyślij kod ponownie'}
        </Text>
      </Pressable>
      <AuthLink
        prompt='Masz już potwierdzone konto?'
        label='Zaloguj się'
        href='/(auth)/sign-in'
      />
    </FormScreen>
  );
}
