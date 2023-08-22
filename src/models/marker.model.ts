import type { Database } from "./schema.model";

export interface Marker {
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

export interface MarkerState {
    currentPage:number;
    markers: Marker[];
    isLoading: boolean;
    indicators: {title: string, counter: number}[]
}

export type MarkerType = Database['public']['Tables']['task']['Row'];