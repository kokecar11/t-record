import type { Marker } from "@prisma/client";

export interface MarkerState {
    currentPage:number;
    markers: Marker[];
    allMarkers: Marker[];
    isLoading: boolean;
    indicators: {title: string, counter: number}[]
}
