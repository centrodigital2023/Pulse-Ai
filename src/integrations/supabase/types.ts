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
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          link_id: string
          order_id: string | null
          owner_id: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          amount?: number
          created_at?: string
          id?: string
          link_id: string
          order_id?: string | null
          owner_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          link_id?: string
          order_id?: string | null
          owner_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          affiliate_id: string
          clicks: number
          code: string
          conversions: number
          created_at: string
          id: string
          program_id: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          clicks?: number
          code: string
          conversions?: number
          created_at?: string
          id?: string
          program_id: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          clicks?: number
          code?: string
          conversions?: number
          created_at?: string
          id?: string
          program_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_programs: {
        Row: {
          commission_rate: number
          created_at: string
          id: string
          name: string
          owner_id: string
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          id?: string
          name: string
          owner_id: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_programs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          owner_id: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          owner_id: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          owner_id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          ip: string | null
          metadata: Json | null
          owner_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip?: string | null
          metadata?: Json | null
          owner_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip?: string | null
          metadata?: Json | null
          owner_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          code: string
          course_id: string | null
          id: string
          issued_at: string
          owner_id: string
          title: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          code?: string
          course_id?: string | null
          id?: string
          issued_at?: string
          owner_id: string
          title?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          code?: string
          course_id?: string | null
          id?: string
          issued_at?: string
          owner_id?: string
          title?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          module_id: string
          owner_id: string
          position: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          module_id: string
          owner_id: string
          position?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          module_id?: string
          owner_id?: string
          position?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          owner_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          owner_id: string
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          owner_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          owner_id: string
          product_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          product_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          product_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
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
      downloads: {
        Row: {
          buyer_id: string
          created_at: string
          file_name: string | null
          id: string
          ip: string | null
          order_id: string | null
          owner_id: string | null
          product_id: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string
          file_name?: string | null
          id?: string
          ip?: string | null
          order_id?: string | null
          owner_id?: string | null
          product_id?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string
          file_name?: string | null
          id?: string
          ip?: string | null
          order_id?: string | null
          owner_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          body: string | null
          created_at: string
          id: string
          name: string
          owner_id: string
          scheduled_at: string | null
          sent_count: number
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          name: string
          owner_id: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_sequences: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          status: string
          steps: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          status?: string
          steps?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          status?: string
          steps?: Json
          updated_at?: string
        }
        Relationships: []
      }
      license_activations: {
        Row: {
          activated_at: string
          device_id: string | null
          device_name: string | null
          id: string
          ip: string | null
          license_id: string
          owner_id: string
          status: string
        }
        Insert: {
          activated_at?: string
          device_id?: string | null
          device_name?: string | null
          id?: string
          ip?: string | null
          license_id: string
          owner_id: string
          status?: string
        }
        Update: {
          activated_at?: string
          device_id?: string | null
          device_name?: string | null
          id?: string
          ip?: string | null
          license_id?: string
          owner_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_activations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "license_keys"
            referencedColumns: ["id"]
          },
        ]
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
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          owner_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          owner_id?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          owner_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          buyer_email: string | null
          buyer_id: string | null
          created_at: string
          currency: string
          download_url: string | null
          group_ref: string
          id: string
          installments: number
          mp_payment_id: string | null
          mp_preference_id: string | null
          payment_method: string | null
          product_id: string | null
          product_image: string | null
          product_name: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          buyer_email?: string | null
          buyer_id?: string | null
          created_at?: string
          currency?: string
          download_url?: string | null
          group_ref?: string
          id?: string
          installments?: number
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_image?: string | null
          product_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_email?: string | null
          buyer_id?: string | null
          created_at?: string
          currency?: string
          download_url?: string | null
          group_ref?: string
          id?: string
          installments?: number
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          payment_method?: string | null
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          custom_domain: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          plan: string
          slug: string | null
          updated_at: string
          white_label: boolean
        }
        Insert: {
          created_at?: string
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          plan?: string
          slug?: string | null
          updated_at?: string
          white_label?: boolean
        }
        Update: {
          created_at?: string
          custom_domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          plan?: string
          slug?: string | null
          updated_at?: string
          white_label?: boolean
        }
        Relationships: []
      }
      product_assets: {
        Row: {
          created_at: string
          id: string
          kind: string | null
          name: string
          owner_id: string
          product_id: string
          size_bytes: number | null
          storage_path: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string | null
          name: string
          owner_id: string
          product_id: string
          size_bytes?: number | null
          storage_path?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string | null
          name?: string
          owner_id?: string
          product_id?: string
          size_bytes?: number | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_assets_product_id_fkey"
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
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
      product_versions: {
        Row: {
          changelog: string | null
          created_at: string
          id: string
          is_current: boolean
          owner_id: string
          product_id: string
          version: string
        }
        Insert: {
          changelog?: string | null
          created_at?: string
          id?: string
          is_current?: boolean
          owner_id: string
          product_id: string
          version: string
        }
        Update: {
          changelog?: string | null
          created_at?: string
          id?: string
          is_current?: boolean
          owner_id?: string
          product_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_versions_product_id_fkey"
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
      subscription_events: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          owner_id: string
          subscription_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          owner_id: string
          subscription_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          owner_id?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          current_period_end: string | null
          customer_id: string | null
          id: string
          interval: string
          owner_id: string
          plan: string
          product_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          current_period_end?: string | null
          customer_id?: string | null
          id?: string
          interval?: string
          owner_id: string
          plan: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          current_period_end?: string | null
          customer_id?: string | null
          id?: string
          interval?: string
          owner_id?: string
          plan?: string
          product_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          slug?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          author: string
          body: string
          created_at: string
          id: string
          owner_id: string
          ticket_id: string
        }
        Insert: {
          author: string
          body: string
          created_at?: string
          id?: string
          owner_id: string
          ticket_id: string
        }
        Update: {
          author?: string
          body?: string
          created_at?: string
          id?: string
          owner_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          owner_id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          owner_id: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          owner_id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
      webhooks: {
        Row: {
          active: boolean
          created_at: string
          events: string[]
          id: string
          owner_id: string
          secret: string | null
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          events?: string[]
          id?: string
          owner_id: string
          secret?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          events?: string[]
          id?: string
          owner_id?: string
          secret?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      become_seller: { Args: never; Returns: undefined }
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
