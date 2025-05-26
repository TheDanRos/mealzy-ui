export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          name: string;
          created_at: string;
        }>;
      };

      members: {
        Row: {
          id: string;
          user_id: string;
          household_id: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_id: string;
          first_name?: string | null;
          last_name?: string | null;
          role: string;
          created_at?: string;
        };
        Update: Partial<{
          id: string;
          user_id: string;
          household_id: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          created_at: string;
        }>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
