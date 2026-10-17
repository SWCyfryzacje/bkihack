import type {
  CategoryValue,
  ScopeValue,
  VotingStage,
  VotingStatus,
  VotingVoteValue,
} from '@/types/type';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_id: string | null;
          first_name: string;
          last_name: string;
          area_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          clerk_id?: string | null;
          first_name?: string;
          last_name?: string;
          area_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string | null;
          first_name?: string;
          last_name?: string;
          area_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
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
          status: VotingStatus;
          stage: VotingStage | null;
          stage_area_id: string | null;
          stage_started_at: string | null;
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
          status: VotingStatus;
          stage: VotingStage | null;
          stage_area_name: string | null;
          stage_ends_at: string | null;
          stage_threshold: number | null;
          stage_eligible: number | null;
          stage_voters: number | null;
          stage_votes_for: number | null;
          stage_votes_against: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_mcp_token: { Args: never; Returns: string };
      current_profile_id: { Args: never; Returns: string | null };
      advance_votings: { Args: never; Returns: undefined };
      cast_voting_vote: {
        Args: { p_voting_id: string; p_value: VotingVoteValue };
        Returns: undefined;
      };
      complete_onboarding: {
        Args: { p_first_name: string; p_last_name: string; p_area_id: string };
        Returns: undefined;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
