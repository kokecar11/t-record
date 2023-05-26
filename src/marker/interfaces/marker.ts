import type { MarkerType } from "~/core/supabase/supabase";

export interface MarkerI {
    fk_user: string;
    id: number;
    start_title: string;
    end_title: string;
    status: string;
    created_at:Date;
    updated_at: Date | null;
    stream_date: Date | string;
}
  
export interface MarkerStateI {
    currentPage:number;
    markers: MarkerType[];
    isLoading: boolean;
    indicators: {title: string, counter: number}[]
}
