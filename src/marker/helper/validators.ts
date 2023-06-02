export const validateInitMarker = (status:string, streamStatus:string, streamDate:string | Date, isInit:boolean) => {
    const stream = new Date(streamDate).toDateString()
    const now = new Date(Date.now())
    if(Date.parse(stream) !== now.setHours(0,0,0,0)){ //TODO:VALIDAR FECHA EXACTA
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