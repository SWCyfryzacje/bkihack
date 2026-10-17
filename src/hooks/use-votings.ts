import { useCallback, useEffect, useState } from 'react';
import {
  fetchVotings,
  subscribeToVotings,
} from '@/repositories/voting-repository';
import type { Voting } from '@/types/type';

export function useVotings() {
  const [votings, setVotings] = useState<Voting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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

    const unsubscribe = subscribeToVotings(() => {
      if (!active) return;
      if (!initialized) {
        refreshPending = true;
        return;
      }

      void refresh();
    });

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
      unsubscribe();
    };
  }, [reloadKey]);

  return { votings, loading, error, retry };
}
