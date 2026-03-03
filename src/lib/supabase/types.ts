export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      financial_profiles: {
        Row: {
          id: string
          monthly_expenses: number | null
          monthly_income: number | null
          total_debt: number | null
          total_savings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          monthly_expenses?: number | null
          monthly_income?: number | null
          total_debt?: number | null
          total_savings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          monthly_expenses?: number | null
          monthly_income?: number | null
          total_debt?: number | null
          total_savings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          deadline: string | null
          id: string
          target_amount: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          deadline?: string | null
          id?: string
          target_amount: number
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          deadline?: string | null
          id?: string
          target_amount?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          acknowledged_at: string | null
          actions: Json
          advisor_id: string
          ai_generated: boolean | null
          client_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          sent_at: string | null
          status: string
          summary: string
        }
        Insert: {
          acknowledged_at?: string | null
          actions?: Json
          advisor_id: string
          ai_generated?: boolean | null
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          summary: string
        }
        Update: {
          acknowledged_at?: string | null
          actions?: Json
          advisor_id?: string
          ai_generated?: boolean | null
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      score_snapshots: {
        Row: {
          breakdown: Json
          created_at: string | null
          id: string
          score: number
          user_id: string
        }
        Insert: {
          breakdown: Json
          created_at?: string | null
          id?: string
          score: number
          user_id: string
        }
        Update: {
          breakdown?: Json
          created_at?: string | null
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  T extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends T extends { schema: keyof Database }
    ? keyof (Database[T["schema"]]["Tables"] &
        Database[T["schema"]]["Views"])
    : never = never,
> = T extends { schema: keyof Database }
  ? (Database[T["schema"]]["Tables"] &
      Database[T["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[T] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  T extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends T extends { schema: keyof Database }
    ? keyof Database[T["schema"]]["Tables"]
    : never = never,
> = T extends { schema: keyof Database }
  ? Database[T["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : T extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][T] extends {
        Insert: infer I
      }
      ? I
      : never
    : never
