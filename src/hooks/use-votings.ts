import { useCallback, useEffect, useState } from 'react';
import {
  fetchVotings,
  subscribeToVotings,
  type VotingChange,
} from '@/repositories/voting-repository';
import type { Voting } from '@/types/type';

function applyVotingChange(votings: Voting[], change: VotingChange): Voting[] {
  if (change.event === 'DELETE') {
    return votings.filter((voting) => voting.id !== change.id);
  }

  const index = votings.findIndex((voting) => voting.id === change.voting.id);
  if (index < 0) return [change.voting, ...votings];

  return votings.map((voting, currentIndex) =>
    currentIndex === index ? change.voting : voting,
  );
}

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
    const pendingChanges: VotingChange[] = [];

    const unsubscribe = subscribeToVotings((change) => {
      if (!active) return;
      if (!initialized) {
        pendingChanges.push(change);
        return;
      }

      setVotings((current) => applyVotingChange(current, change));
    });

    void fetchVotings()
      .then((records) => {
        if (!active) return;
        setVotings(pendingChanges.reduce(applyVotingChange, records));
        pendingChanges.length = 0;
        initialized = true;
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setVotings(pendingChanges.reduce(applyVotingChange, []));
        pendingChanges.length = 0;
        initialized = true;
        setError(
          caught instanceof Error
            ? caught.message
            : 'Nieznany błąd podczas pobierania głosowań.',
        );
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