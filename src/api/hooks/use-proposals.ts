import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../client';
import { fetchProposals, type ProposalFilter } from '../proposals';
import type { Proposal } from '../types';

const DEBOUNCE_MS = 300;

// Lista propozycji odświeżana na żywo przy każdym głosie / nowej propozycji.
export function useProposals(filter: ProposalFilter = {}) {
  const { areaId, scope } = filter;
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    try {
      setProposals(await fetchProposals({ areaId, scope }));
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [areaId, scope]);

  useEffect(() => {
    setLoading(true);
    refresh();

    const schedule = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(refresh, DEBOUNCE_MS);
    };
    const channel = supabase
      .channel(`proposals:${areaId ?? '*'}:${scope ?? '*'}:${Math.random()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes' },
        schedule
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        schedule
      )
      .subscribe();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [refresh, areaId, scope]);

  return { proposals, loading, error, refresh };
}
