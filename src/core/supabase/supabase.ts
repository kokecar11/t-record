
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Database {
  public: {
    Tables: {
      task: {
        Row: {
          fk_user: string;
          id: number;
          title: string;
          starts_at: number;
          ends_at: number;
          video: string;
          created_at:Date;
          updated_at: Date | null;
          stream_date: Date;
          status:string;
        }
        Insert: {

        }
        Update: {

        }
      }
    }
  }
}

export const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
export type MarkerType = Database['public']['Tables']['task']['Row'];