import type { Marker } from "@prisma/client";

export interface MarkerState {
    currentPage:number;
    markers: Marker[];
    allMarkers: MarkerDate[];
    isLoading: boolean;
}


export interface MarkerDate {
    stream_date: Date
    title: string
}