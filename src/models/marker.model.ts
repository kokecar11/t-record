import type { Marker } from "@prisma/client";
import type { Database } from "./schema.model";

export interface MarkerState {
    currentPage:number;
    markers: Marker[];
    isLoading: boolean;
    indicators: {title: string, counter: number}[]
}

export type MarkerType = Database['public']['Tables']['task']['Row'];