import { createContextId } from "@builder.io/qwik";

export interface Live {
    status: StatusLive;
}

export type StatusLive = 'offline' | 'live';

export const LiveStreamContext = createContextId<Live>('live.stream-context');
