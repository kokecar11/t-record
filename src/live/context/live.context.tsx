import { createContextId } from "@builder.io/qwik";

export interface Live {
    status: StatusLive;
    isLoading: boolean;
}

export type StatusLive = 'offline' | 'live';

export const LiveStreamContext = createContextId<Live>('live.stream-context');
