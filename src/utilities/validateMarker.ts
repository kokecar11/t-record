import { isSameDay } from "date-fns"
import type { Live } from "~/models"


export const validateMarker = (status:string, live:Live, streamDate:Date, isInit:boolean) => {
    const now = new Date(Date.now())

    if(!isSameDay(streamDate, now)) return true

    if (status === 'RECORDED') return true

    if (status === 'RECORDED' || live.status === 'offline' ) if (isInit) return true

    if (status === 'UNRECORDED' && live.status === 'live' ) return false

    if (live.status === 'offline') return true
    return false
}

