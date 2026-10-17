import type { CategoryValue, ScopeValue } from '@/types/type';

export type Database = {
  public: {
    Tables: {
      votings: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: CategoryValue;
          scope: ScopeValue;
          is_anonymous: boolean;
          votes_for: number;
          votes_against: number;
          mechanism: 'for_against';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: CategoryValue;
          scope: ScopeValue;
          is_anonymous: boolean;
          votes_for?: number;
          votes_against?: number;
          mechanism?: 'for_against';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: CategoryValue;
          scope?: ScopeValue;
          is_anonymous?: boolean;
          votes_for?: number;
          votes_against?: number;
          mechanism?: 'for_against';
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_mcp_token: { Args: never; Returns: string };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
