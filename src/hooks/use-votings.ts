import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  fetchVotings,
  subscribeToVotings,
} from '@/repositories/voting-repository';
import type { Voting } from '@/types/type';

const REFRESH_DEBOUNCE_MS = 300;

export function useVotings() {
  const [votings, setVotings] = useState<Voting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const refreshOnFocus = useRef<(() => void) | null>(null);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;
    let initialized = false;
    let refreshPending = false;
    let refreshRequestId = 0;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const refresh = async () => {
      const requestId = ++refreshRequestId;
      try {
        const records = await fetchVotings();
        if (!active || requestId !== refreshRequestId) return;
        setVotings(records);
        setError(null);
      } catch (caught: unknown) {
        if (!active || requestId !== refreshRequestId) return;
        setError(
          caught instanceof Error
            ? caught.message
            : 'Nieznany błąd podczas pobierania głosowań.'
        );
      }
    };

    // Jeden głos potrafi wywołać kilka zdarzeń naraz, więc zbijamy je w jedno pobranie.
    const scheduleRefresh = () => {
      if (!active) return;
      if (!initialized) {
        refreshPending = true;
        return;
      }

      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        void refresh();
      }, REFRESH_DEBOUNCE_MS);
    };

    // Po powrocie na ekran (np. po dodaniu głosowania) pobieramy listę od razu,
    // nie czekając na zdarzenie z Realtime. Pierwsze pobranie robi efekt poniżej.
    refreshOnFocus.current = () => {
      if (active && initialized) scheduleRefresh();
    };

    const unsubscribe = subscribeToVotings(scheduleRefresh);

    void fetchVotings()
      .then((records) => {
        if (!active) return;
        setVotings(records);
        initialized = true;
        if (refreshPending) {
          refreshPending = false;
          void refresh();
        }
      })
      .catch((caught: unknown) => {
        if (!active) return;
        initialized = true;
        setError(
          caught instanceof Error
            ? caught.message
            : 'Nieznany błąd podczas pobierania głosowań.'
        );
        if (refreshPending) {
          refreshPending = false;
          void refresh();
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshOnFocus.current = null;
      unsubscribe();
    };
  }, [reloadKey]);

  useFocusEffect(
    useCallback(() => {
      refreshOnFocus.current?.();
    }, [])
  );

  return { votings, loading, error, retry };
}
