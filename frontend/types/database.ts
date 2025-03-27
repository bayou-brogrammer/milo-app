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
      calendars: {
        Row: {
          id: string
          title: string
          color: string
          source: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          color: string
          source: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          color?: string
          source?: string
          user_id?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          location: string | null
          calendar_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          location?: string | null
          calendar_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          location?: string | null
          calendar_id?: string
          user_id?: string
          created_at?: string
        }
      }
      energy_levels: {
        Row: {
          id: string
          level: string
          description: string | null
          timestamp: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          level: string
          description?: string | null
          timestamp?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          description?: string | null
          timestamp?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}