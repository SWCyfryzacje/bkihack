import { fail, supabase } from './client';

// Adres serwera MCP (nadpisz w .env.local: EXPO_PUBLIC_MCP_URL=...)
export const MCP_BASE_URL =
  process.env.EXPO_PUBLIC_MCP_URL ?? 'https://mcp.jutropolskie.pl';

// Nowy osobisty token MCP (poprzedni przestaje działać). Jawny tylko raz.
export async function createMcpToken(): Promise<string> {
  const { data, error } = await supabase.rpc('create_mcp_token');
  if (error) fail('Nie udało się wygenerować tokenu', error);
  return data;
}

// Pełny adres do wklejenia jako connector w Claude / ChatGPT.
export function mcpConnectorUrl(token: string): string {
  return `${MCP_BASE_URL}/mcp/${token}`;
}
