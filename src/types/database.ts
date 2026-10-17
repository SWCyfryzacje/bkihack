import type { CategoryValue, ScopeValue, VotingVoteValue } from '@/types/type';

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
          baseline_votes_for: number;
          baseline_votes_against: number;
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
      voting_votes: {
        Row: {
          voting_id: string;
          user_id: string;
          value: VotingVoteValue;
          created_at: string;
        };
        Insert: {
          voting_id: string;
          user_id: string;
          value: VotingVoteValue;
          created_at?: string;
        };
        Update: {
          voting_id?: string;
          user_id?: string;
          value?: VotingVoteValue;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      votings_with_counts: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: CategoryValue;
          scope: ScopeValue;
          is_anonymous: boolean;
          created_at: string;
          votes_for: number;
          votes_against: number;
          my_vote: VotingVoteValue | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_mcp_token: { Args: never; Returns: string };
      current_profile_id: { Args: never; Returns: string | null };
      cast_voting_vote: {
        Args: { p_voting_id: string; p_value: VotingVoteValue };
        Returns: undefined;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
