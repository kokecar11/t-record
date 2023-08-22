import type { Live } from "~/models";


export const validateMarker = (status:string, live:Live, streamDate:Date, isInit:boolean) => {
    const stream = new Date(streamDate).toISOString();
    const now = new Date(Date.now()).toISOString();

    if(Date.parse(stream.slice(0,10)) !== Date.parse(now.slice(0,10))){ 
        return true;
    }

    if (status === 'RECORDED'){
        return true;
    }

    if (status === 'RECORDING' || status === 'RECORDED' || live.status === 'offline' ){
        if (isInit) return true;
    }

    if (status === 'UNRECORDED' && live.status === 'live' ){
        return false;
    }

    if (live.status === 'offline') return true;
}

