export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nome: string | null
          clinica: string | null
          plano: string
          simulacoes_restantes: number
          stripe_customer_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          nome?: string | null
          clinica?: string | null
          plano?: string
          simulacoes_restantes?: number
          stripe_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string | null
          clinica?: string | null
          plano?: string
          simulacoes_restantes?: number
          stripe_customer_id?: string | null
          created_at?: string
        }
      }
      simulacoes: {
        Row: {
          id: string
          user_id: string
          fotos_originais: string[]
          foto_resultado: string | null
          ajustes: Json
          prompt_usado: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fotos_originais: string[]
          foto_resultado?: string | null
          ajustes: Json
          prompt_usado?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fotos_originais?: string[]
          foto_resultado?: string | null
          ajustes?: Json
          prompt_usado?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          status: string
          plano: string
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          status: string
          plano: string
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          status?: string
          plano?: string
          current_period_end?: string | null
          created_at?: string
        }
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
  }
}

