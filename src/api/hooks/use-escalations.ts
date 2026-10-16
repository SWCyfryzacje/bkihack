import { useEffect, useRef } from 'react';
import { supabase } from '../client';
import type { ProposalEvent } from '../types';

// Wywołuje onEscalate, gdy jakakolwiek propozycja awansuje poziom wyżej.
export function useEscalations(onEscalate: (e: ProposalEvent) => void) {
  const callback = useRef(onEscalate);
  callback.current = onEscalate;

  useEffect(() => {
    const channel = supabase
      .channel(`proposal_events:${Math.random()}`)
      .on<ProposalEvent>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'proposal_events' },
        (payload) => callback.current(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
