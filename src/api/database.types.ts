// Wygenerowane przez Supabase (generate_typescript_types) — nie edytuj ręcznie
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      areas: {
        Row: {
          id: string;
          level: Database['public']['Enums']['area_level'];
          name: string;
          parent_id: string | null;
        };
        Insert: {
          id: string;
          level: Database['public']['Enums']['area_level'];
          name: string;
          parent_id?: string | null;
        };
        Update: {
          id?: string;
          level?: Database['public']['Enums']['area_level'];
          name?: string;
          parent_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'areas_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      mcp_tokens: {
        Row: {
          created_at: string;
          token_hash: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          token_hash: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          token_hash?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'mcp_tokens_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          area_id: string | null;
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
        };
        Insert: {
          area_id?: string | null;
          created_at?: string;
          first_name?: string;
          id: string;
          last_name?: string;
        };
        Update: {
          area_id?: string | null;
          created_at?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      proposal_events: {
        Row: {
          created_at: string;
          from_area_id: string;
          from_scope: Database['public']['Enums']['area_level'];
          id: number;
          proposal_id: string;
          to_area_id: string;
          to_scope: Database['public']['Enums']['area_level'];
          votes_at_escalation: number;
        };
        Insert: {
          created_at?: string;
          from_area_id: string;
          from_scope: Database['public']['Enums']['area_level'];
          id?: never;
          proposal_id: string;
          to_area_id: string;
          to_scope: Database['public']['Enums']['area_level'];
          votes_at_escalation: number;
        };
        Update: {
          created_at?: string;
          from_area_id?: string;
          from_scope?: Database['public']['Enums']['area_level'];
          id?: never;
          proposal_id?: string;
          to_area_id?: string;
          to_scope?: Database['public']['Enums']['area_level'];
          votes_at_escalation?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'proposal_events_from_area_id_fkey';
            columns: ['from_area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'proposal_events_proposal_id_fkey';
            columns: ['proposal_id'];
            isOneToOne: false;
            referencedRelation: 'proposals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'proposal_events_proposal_id_fkey';
            columns: ['proposal_id'];
            isOneToOne: false;
            referencedRelation: 'proposals_with_counts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'proposal_events_to_area_id_fkey';
            columns: ['to_area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
        ];
      };
      proposals: {
        Row: {
          agent_note: string | null;
          area_id: string;
          author_id: string;
          body: string;
          category: Database['public']['Enums']['proposal_category'];
          created_at: string;
          id: string;
          scope: Database['public']['Enums']['area_level'];
          source: Database['public']['Enums']['proposal_source'];
          status: Database['public']['Enums']['proposal_status'];
          title: string;
        };
        Insert: {
          agent_note?: string | null;
          area_id: string;
          author_id: string;
          body?: string;
          category?: Database['public']['Enums']['proposal_category'];
          created_at?: string;
          id?: string;
          scope?: Database['public']['Enums']['area_level'];
          source?: Database['public']['Enums']['proposal_source'];
          status?: Database['public']['Enums']['proposal_status'];
          title: string;
        };
        Update: {
          agent_note?: string | null;
          area_id?: string;
          author_id?: string;
          body?: string;
          category?: Database['public']['Enums']['proposal_category'];
          created_at?: string;
          id?: string;
          scope?: Database['public']['Enums']['area_level'];
          source?: Database['public']['Enums']['proposal_source'];
          status?: Database['public']['Enums']['proposal_status'];
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'proposals_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'proposals_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      votes: {
        Row: {
          created_at: string;
          proposal_id: string;
          user_id: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          proposal_id: string;
          user_id: string;
          value?: number;
        };
        Update: {
          created_at?: string;
          proposal_id?: string;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'votes_proposal_id_fkey';
            columns: ['proposal_id'];
            isOneToOne: false;
            referencedRelation: 'proposals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votes_proposal_id_fkey';
            columns: ['proposal_id'];
            isOneToOne: false;
            referencedRelation: 'proposals_with_counts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      proposals_with_counts: {
        Row: {
          agent_note: string | null;
          area_id: string | null;
          area_name: string | null;
          author_first_name: string | null;
          author_id: string | null;
          body: string | null;
          category: Database['public']['Enums']['proposal_category'] | null;
          created_at: string | null;
          id: string | null;
          scope: Database['public']['Enums']['area_level'] | null;
          source: Database['public']['Enums']['proposal_source'] | null;
          status: Database['public']['Enums']['proposal_status'] | null;
          threshold: number | null;
          title: string | null;
          votes_down: number | null;
          votes_up: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'proposals_area_id_fkey';
            columns: ['area_id'];
            isOneToOne: false;
            referencedRelation: 'areas';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'proposals_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      area_parent: { Args: { p_area_id: string }; Returns: string };
      cast_vote: {
        Args: { p_proposal_id: string; p_value?: number };
        Returns: {
          area_id: string;
          escalated: boolean;
          scope: Database['public']['Enums']['area_level'];
          votes_up: number;
        }[];
      };
      create_mcp_token: { Args: never; Returns: string };
      escalation_threshold: {
        Args: { p_scope: Database['public']['Enums']['area_level'] };
        Returns: number;
      };
    };
    Enums: {
      area_level: 'osiedle' | 'okreg' | 'miasto';
      proposal_category: 'general' | 'city_task' | 'legislative';
      proposal_source: 'app' | 'mcp';
      proposal_status: 'open' | 'escalated' | 'closed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      area_level: ['osiedle', 'okreg', 'miasto'],
      proposal_category: ['general', 'city_task', 'legislative'],
      proposal_source: ['app', 'mcp'],
      proposal_status: ['open', 'escalated', 'closed'],
    },
  },
} as const;
