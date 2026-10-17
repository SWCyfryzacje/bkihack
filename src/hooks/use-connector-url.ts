import { useState } from 'react';
import { createMcpToken, mcpConnectorUrl } from '@/repositories/mcp-token-repository';

// Generuje token MCP i zwraca gotowy adres connectora.
// Token jest jawny tylko raz — po opuszczeniu ekranu trzeba wygenerować nowy.
export function useConnectorUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      setUrl(mcpConnectorUrl(await createMcpToken()));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nie udało się wygenerować adresu.');
    } finally {
      setLoading(false);
    }
  }

  return { url, error, loading, generate };
}
