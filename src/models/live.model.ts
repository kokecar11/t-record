export interface Live {
    status: StatusLive;
    isLoading?: boolean;
    vod?: string;
    gameId?: string;
}

export type StatusLive = 'offline' | 'live';
