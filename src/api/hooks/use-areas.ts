import { useEffect, useState } from 'react';
import { fetchAreas } from '../areas';
import type { Area, AreaLevel } from '../types';

export function useAreas(level?: AreaLevel) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAreas(level)
      .then((data) => active && setAreas(data))
      .catch((e: Error) => active && setError(e))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [level]);

  return { areas, loading, error };
}
