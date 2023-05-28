import type { RequestEventBase } from "@builder.io/qwik-city";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "supabase-auth-helpers-qwik";

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
            stream_date: Date | string;
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