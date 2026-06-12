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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          activations: number
          created_at: string
          email: string
          id: string
          last_ip: string | null
          location: string | null
          ltv: number
          name: string
          owner_id: string
          products: number
          segment: string
          spent: number
        }
        Insert: {
          activations?: number
          created_at?: string
          email: string
          id?: string
          last_ip?: string | null
          location?: string | null
          ltv?: number
          name: string
          owner_id: string
          products?: number
          segment?: string
          spent?: number
        }
        Update: {
          activations?: number
          created_at?: string
          email?: string
          id?: string
          last_ip?: string | null
          location?: string | null
          ltv?: number
          name?: string
          owner_id?: string
          products?: number
          segment?: string
          spent?: number
        }
        Relationships: []
      }
      license_keys: {
        Row: {
          activation_limit: number
          activations: number
          created_at: string
          customer_name: string | null
          expires_at: string | null
          id: string
          key: string
          owner_id: string
          product_id: string | null
          product_name: string | null
          status: Database["public"]["Enums"]["license_status"]
          type: Database["public"]["Enums"]["license_type"]
        }
        Insert: {
          activation_limit?: number
          activations?: number
          created_at?: string
          customer_name?: string | null
          expires_at?: string | null
          id?: string
          key: string
          owner_id: string
          product_id?: string | null
          product_name?: string | null
          status?: Database["public"]["Enums"]["license_status"]
          type?: Database["public"]["Enums"]["license_type"]
        }
        Update: {
          activation_limit?: number
          activations?: number
          created_at?: string
          customer_name?: string | null
          expires_at?: string | null
          id?: string
          key?: string
          owner_id?: string
          product_id?: string | null
          product_name?: string | null
          status?: Database["public"]["Enums"]["license_status"]
          type?: Database["public"]["Enums"]["license_type"]
        }
        Relationships: [
          {
            foreignKeyName: "license_keys_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_files: {
        Row: {
          created_at: string
          downloads: number
          id: string
          kind: Database["public"]["Enums"]["file_kind"]
          meta: string | null
          name: string
          product_id: string
          size: string | null
          storage_path: string | null
        }
        Insert: {
          created_at?: string
          downloads?: number
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          meta?: string | null
          name: string
          product_id: string
          size?: string | null
          storage_path?: string | null
        }
        Update: {
          created_at?: string
          downloads?: number
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          meta?: string | null
          name?: string
          product_id?: string
          size?: string | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          id: string
          licensing_enabled: boolean
          name: string
          owner_id: string
          price: number
          recurring: boolean
          status: Database["public"]["Enums"]["product_status"]
          tagline: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          licensing_enabled?: boolean
          name: string
          owner_id: string
          price?: number
          recurring?: boolean
          status?: Database["public"]["Enums"]["product_status"]
          tagline?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          licensing_enabled?: boolean
          name?: string
          owner_id?: string
          price?: number
          recurring?: boolean
          status?: Database["public"]["Enums"]["product_status"]
          tagline?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "creator" | "user"
      file_kind: "code" | "doc" | "video" | "audio" | "image"
      license_status: "active" | "expired" | "revoked"
      license_type: "personal" | "professional" | "enterprise" | "white_label"
      product_status: "live" | "draft"
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
    Enums: {
      app_role: ["admin", "creator", "user"],
      file_kind: ["code", "doc", "video", "audio", "image"],
      license_status: ["active", "expired", "revoked"],
      license_type: ["personal", "professional", "enterprise", "white_label"],
      product_status: ["live", "draft"],
    },
  },
} as const
