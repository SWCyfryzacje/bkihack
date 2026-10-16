import { fail, supabase } from './client';

// Nowy osobisty token MCP (poprzedni przestaje działać). Jawny tylko raz.
export async function createMcpToken(): Promise<string> {
  const { data, error } = await supabase.rpc('create_mcp_token');
  if (error) fail('Nie udało się wygenerować tokenu', error);
  return data;
}
