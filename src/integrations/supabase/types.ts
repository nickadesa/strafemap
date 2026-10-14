export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      duel_guesses: {
        Row: {
          created_at: string
          duel_id: string
          id: string
          lat: number | null
          lng: number | null
          round: number
          user_id: string
        }
        Insert: {
          created_at?: string
          duel_id: string
          id?: string
          lat?: number | null
          lng?: number | null
          round: number
          user_id: string
        }
        Update: {
          created_at?: string
          duel_id?: string
          id?: string
          lat?: number | null
          lng?: number | null
          round?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duel_guesses_duel_id_fkey"
            columns: ["duel_id"]
            isOneToOne: false
            referencedRelation: "duels"
            referencedColumns: ["id"]
          },
        ]
      }
      duels: {
        Row: {
          code: string
          created_at: string
          guest_hp: number
          guest_id: string | null
          guest_name: string | null
          host_hp: number
          host_id: string
          host_name: string
          id: string
          location_ids: Json
          round: number
          round_started_at: string | null
          status: string
        }
        Insert: {
          code: string
          created_at?: string
          guest_hp?: number
          guest_id?: string | null
          guest_name?: string | null
          host_hp?: number
          host_id: string
          host_name?: string
          id?: string
          location_ids?: Json
          round?: number
          round_started_at?: string | null
          status?: string
        }
        Update: {
          code?: string
          created_at?: string
          guest_hp?: number
          guest_id?: string | null
          guest_name?: string | null
          host_hp?: number
          host_id?: string
          host_name?: string
          id?: string
          location_ids?: Json
          round?: number
          round_started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      game_records: {
        Row: {
          daily: boolean
          date: string
          id: string
          max: number
          mode: string
          player: string
          rounds: Json
          score: number
          user_id: string
        }
        Insert: {
          daily?: boolean
          date?: string
          id?: string
          max: number
          mode: string
          player: string
          rounds?: Json
          score: number
          user_id: string
        }
        Update: {
          daily?: boolean
          date?: string
          id?: string
          max?: number
          mode?: string
          player?: string
          rounds?: Json
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      parties: {
        Row: {
          code: string
          created_at: string
          difficulty: string
          host_id: string
          id: string
          location_ids: Json
          pool: string
          revealed_round: number
          round: number
          round_started_at: string | null
          rounds: number
          status: string
          time_limit: number
        }
        Insert: {
          code: string
          created_at?: string
          difficulty?: string
          host_id: string
          id?: string
          location_ids?: Json
          pool?: string
          revealed_round?: number
          round?: number
          round_started_at?: string | null
          rounds?: number
          status?: string
          time_limit?: number
        }
        Update: {
          code?: string
          created_at?: string
          difficulty?: string
          host_id?: string
          id?: string
          location_ids?: Json
          pool?: string
          revealed_round?: number
          round?: number
          round_started_at?: string | null
          rounds?: number
          status?: string
          time_limit?: number
        }
        Relationships: []
      }
      party_guesses: {
        Row: {
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          party_id: string
          round: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          party_id: string
          round: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          party_id?: string
          round?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_guesses_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      party_players: {
        Row: {
          id: string
          joined_at: string
          name: string
          party_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          name?: string
          party_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          name?: string
          party_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_players_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_duel_player: { Args: { _duel: string }; Returns: boolean }
      is_party_member: { Args: { _party: string }; Returns: boolean }
      join_duel: { Args: { _code: string; _name: string }; Returns: string }
      join_party: { Args: { _code: string; _name: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
