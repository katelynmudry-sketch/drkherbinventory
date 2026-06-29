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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      herbs: {
        Row: {
          common_name: string | null
          created_at: string
          id: string
          latin_name: string | null
          low_threshold_lb: number
          name: string
          notes: string | null
          pinyin_name: string | null
          preferred_name: 'common' | 'latin' | 'pinyin' | null
          updated_at: string
          user_id: string
        }
        Insert: {
          common_name?: string | null
          created_at?: string
          id?: string
          latin_name?: string | null
          low_threshold_lb?: number
          name: string
          notes?: string | null
          pinyin_name?: string | null
          preferred_name?: 'common' | 'latin' | 'pinyin' | null
          updated_at?: string
          user_id: string
        }
        Update: {
          common_name?: string | null
          created_at?: string
          id?: string
          latin_name?: string | null
          low_threshold_lb?: number
          name?: string
          notes?: string | null
          pinyin_name?: string | null
          preferred_name?: 'common' | 'latin' | 'pinyin' | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          current_batch_id: string | null
          current_bulk_batch_id: string | null
          herb_id: string
          id: string
          location: string
          notes: string | null
          quantity: number
          status: string
          tincture_ready_at: string | null
          tincture_started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_batch_id?: string | null
          current_bulk_batch_id?: string | null
          herb_id: string
          id?: string
          location: string
          notes?: string | null
          quantity?: number
          status?: string
          tincture_ready_at?: string | null
          tincture_started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_batch_id?: string | null
          current_bulk_batch_id?: string | null
          herb_id?: string
          id?: string
          location?: string
          notes?: string | null
          quantity?: number
          status?: string
          tincture_ready_at?: string | null
          tincture_started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_herb_id_fkey"
            columns: ["herb_id"]
            isOneToOne: false
            referencedRelation: "herbs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_current_batch_id_fkey"
            columns: ["current_batch_id"]
            isOneToOne: false
            referencedRelation: "tincture_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_current_bulk_batch_id_fkey"
            columns: ["current_bulk_batch_id"]
            isOneToOne: false
            referencedRelation: "bulk_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_batches: {
        Row: {
          id: string
          user_id: string
          herb_id: string
          batch_number: string
          received_date: string
          status: 'available' | 'depleted'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          herb_id: string
          batch_number: string
          received_date?: string
          status?: 'available' | 'depleted'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          herb_id?: string
          batch_number?: string
          received_date?: string
          status?: 'available' | 'depleted'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_batches_herb_id_fkey"
            columns: ["herb_id"]
            isOneToOne: false
            referencedRelation: "herbs"
            referencedColumns: ["id"]
          },
        ]
      }
      tincture_batches: {
        Row: {
          id: string
          user_id: string
          herb_id: string
          batch_number: string
          batch_date: string
          status: 'macerating' | 'active' | 'archived'
          pressed_date: string | null
          notes: string | null
          bulk_inventory_id: string | null
          bulk_batch_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          herb_id: string
          batch_number: string
          batch_date?: string
          status?: 'macerating' | 'active' | 'archived'
          pressed_date?: string | null
          notes?: string | null
          bulk_inventory_id?: string | null
          bulk_batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          herb_id?: string
          batch_number?: string
          batch_date?: string
          status?: 'macerating' | 'active' | 'archived'
          pressed_date?: string | null
          notes?: string | null
          bulk_inventory_id?: string | null
          bulk_batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tincture_batches_herb_id_fkey"
            columns: ["herb_id"]
            isOneToOne: false
            referencedRelation: "herbs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tincture_batches_bulk_inventory_id_fkey"
            columns: ["bulk_inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tincture_batches_bulk_batch_id_fkey"
            columns: ["bulk_batch_id"]
            isOneToOne: false
            referencedRelation: "bulk_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      herb_pricing: {
        Row: {
          id: string
          user_id: string
          herb_name: string
          supplier_id: string
          price_per_lb: number
          package_size_g: number | null
          package_price: number | null
          supplier_item_code: string | null
          supplier_item_name: string | null
          notes: string | null
          last_updated: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          herb_name: string
          supplier_id: string
          price_per_lb: number
          package_size_g?: number | null
          package_price?: number | null
          supplier_item_code?: string | null
          supplier_item_name?: string | null
          notes?: string | null
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          herb_name?: string
          supplier_id?: string
          price_per_lb?: number
          package_size_g?: number | null
          package_price?: number | null
          supplier_item_code?: string | null
          supplier_item_name?: string | null
          notes?: string | null
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "herb_pricing_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      herb_reorder_qty: {
        Row: {
          id: string
          user_id: string
          herb_name: string
          quantity_lb: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          herb_name: string
          quantity_lb?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          herb_name?: string
          quantity_lb?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan_tier: 'none' | 'basic' | 'pro'
          status: string
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_tier?: 'none' | 'basic' | 'pro'
          status?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_tier?: 'none' | 'basic' | 'pro'
          status?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      voice_api_usage: {
        Row: {
          id: string
          user_id: string
          created_at: string
          model: string
          input_tokens: number
          output_tokens: number
          transcript_len: number | null
          action_count: number
          success: boolean
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          model: string
          input_tokens?: number
          output_tokens?: number
          transcript_len?: number | null
          action_count?: number
          success?: boolean
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          model?: string
          input_tokens?: number
          output_tokens?: number
          transcript_len?: number | null
          action_count?: number
          success?: boolean
          error_message?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_batch_number: {
        Args: {
          p_herb_id: string
          p_user_id: string
          p_year?: number
        }
        Returns: string
      }
      generate_bulk_batch_number: {
        Args: {
          p_herb_id: string
          p_user_id: string
          p_year?: number
        }
        Returns: string
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
