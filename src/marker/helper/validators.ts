export const validateInitMarker = (status:string, streamStatus:string, streamDate:string | Date, isInit:boolean) => {
    const stream = new Date(streamDate).toDateString()
    
    if(Date.parse(stream) < Date.now()){ //TODO:VALIDAR FECHA EXACTA
        return true
    }
    if (status === 'RECORDED'){
        return true
    }
    if (status === 'RECORDING' || status === 'RECORDED' || streamStatus === 'offline' ){
        if (isInit) return true
    }
    if (status === 'UNRECORDED' && streamStatus === 'live' ){
        return false
    }
    if (streamStatus === 'offline') return true
}