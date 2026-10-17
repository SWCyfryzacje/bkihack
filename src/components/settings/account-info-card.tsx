import { Text, View } from 'react-native';
import { useUser } from '@clerk/expo';
import { useMyProfile } from '@/hooks/use-my-profile';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className='gap-1'>
      <Text className='font-cnt-bold text-sm text-neutral-600'>{label}</Text>
      <Text className='font-cnt text-base text-neutral-900'>{value}</Text>
    </View>
  );
}

export default function AccountInfoCard() {
  const { isLoaded, user } = useUser();
  const { profile, loading, error } = useMyProfile();

  // Profil z Supabase jest źródłem prawdy; Clerk tylko jako zapas.
  const firstName = profile?.firstName || user?.firstName || 'Brak danych';
  const lastName = profile?.lastName || user?.lastName || 'Brak danych';

  return (
    <View className='bg-surface gap-4 rounded-2xl border border-neutral-200 p-5'>
      <Text className='font-hd-bold text-xl text-neutral-900'>
        Informacje o koncie
      </Text>
      {!isLoaded || loading ? (
        <Text className='font-cnt text-base text-neutral-600'>
          Ładowanie danych użytkownika...
        </Text>
      ) : (
        <>
          <InfoRow
            label='Imię'
            value={firstName}
          />
          <InfoRow
            label='Nazwisko'
            value={lastName}
          />
          <InfoRow
            label='Osiedle'
            value={profile?.areaName ?? 'Nie wybrano osiedla'}
          />
          <InfoRow
            label='Adres e-mail'
            value={
              user?.primaryEmailAddress?.emailAddress || 'Brak adresu e-mail'
            }
          />
          {error ? (
            <Text
              accessibilityRole='alert'
              className='font-cnt text-danger text-sm'>
              {error}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}
