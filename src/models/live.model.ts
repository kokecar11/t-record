export interface Live {
    status: StatusLive;
    isLoading?: boolean;
}

export type StatusLive = 'offline' | 'live';
