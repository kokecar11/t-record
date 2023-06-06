export const validateMarker = (status:string, streamStatus:string, streamDate:Date, isInit:boolean) => {
    const stream = new Date(streamDate).toISOString();
    const now = new Date(Date.now()).toISOString();

    if(Date.parse(stream.slice(0,10)) !== Date.parse(now.slice(0,10))){ 
        return true;
    }

    if (status === 'RECORDED'){
        return true;
    }

    if (status === 'RECORDING' || status === 'RECORDED' || streamStatus === 'offline' ){
        if (isInit) return true;
    }

    if (status === 'UNRECORDED' && streamStatus === 'live' ){
        return false;
    }

    if (streamStatus === 'offline') return true;
}

