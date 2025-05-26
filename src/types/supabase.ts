export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      households: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id?: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
      };
      members: {
        Row: {
          id: string;
          user_id: string;
          household_id: string;
          role: string;
          first_name: string;
          last_name: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          household_id: string;
          role: string;
          first_name?: string;
          last_name?: string;
        };
        Update: Partial<Insert>;
      };
    };
  };
};
