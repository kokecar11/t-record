
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Database {
    public: {
      Tables: {
        MarkerTest: {
          Row: {
            fk_user: string;
            id: number;
            start_title: string;
            end_title: string;
            status: string;
            created_at:Date;
            updated_at: Date | null;
            stream_date: Date;
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
export type MarkerType = Database['public']['Tables']['MarkerTest']['Row'];