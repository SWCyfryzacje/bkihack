import { supabase } from '@/lib/supabase';

// Adres serwera MCP (nadpisz w .env: EXPO_PUBLIC_MCP_URL=...)
const MCP_BASE_URL = process.env.EXPO_PUBLIC_MCP_URL ?? 'https://mcp.jutropolskie.pl';

// Nowy osobisty token MCP zalogowanego użytkownika (Clerk). Poprzedni przestaje działać.
export async function createMcpToken(): Promise<string> {
  const { data, error } = await supabase.rpc('create_mcp_token');
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Supabase did not return an MCP token.');
  return data;
}

export function mcpConnectorUrl(token: string): string {
  return `${MCP_BASE_URL}/mcp/${token}`;
}
