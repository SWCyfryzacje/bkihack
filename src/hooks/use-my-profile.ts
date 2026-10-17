import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  fetchMyProfile,
  type MyProfile,
} from '@/repositories/profile-repository';

// Profil zalogowanego mieszkańca z Supabase, odświeżany przy wejściu na ekran.
export function useMyProfile() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      fetchMyProfile()
        .then((record) => {
          if (!active) return;
          setProfile(record);
          setError(null);
        })
        .catch((caught: unknown) => {
          if (!active) return;
          setError(
            caught instanceof Error
              ? caught.message
              : 'Nie udało się pobrać profilu.'
          );
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  return { profile, loading, error };
}
