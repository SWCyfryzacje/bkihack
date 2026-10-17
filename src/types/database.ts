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
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: CategoryValue;
          scope: ScopeValue;
          is_anonymous: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: CategoryValue;
          scope?: ScopeValue;
          is_anonymous?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
