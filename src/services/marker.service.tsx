import { server$ } from "@builder.io/qwik-city"
import { type Marker } from "@prisma/client"
import { db } from "~/db"



export const getMarkers = server$(async (userId:string, status) => {
    const markers = await db.marker.findMany({
        where: { 
            userId,
            status: {
                in : status
            } 
        },
    })
    return markers
})

export const createMarker = server$(async (data: {title:string, stream_date: Date, userId:string}) => {
    const {title, stream_date, userId } = data
    const marker = await db.marker.create({
        data:{
            userId,
            title,
            stream_date
        }
    })
    return marker
})

export const deleteMarker = server$(async (markerId: string) => {
    const markerDeleted = await db.marker.delete({
        where: { id: markerId }
    })
    return markerDeleted
})


export const setMarkerInStream = server$(async function(isStartMarker: boolean = true, marker:Marker, userId:string) {
    const TWITCH_CLIENT_ID = this.env.get('TWITCH_ID')
    const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers';

    const account = await db.account.findFirst({
        where: { userId }
    })
    const accesTokenProvider = account?.access_token as string
    const providerAccountId = account?.providerAccountId as string
    
    const headers = {
        'Authorization':"Bearer " + accesTokenProvider,
        'Client-Id': TWITCH_CLIENT_ID
    };
    const respStream = await fetch(`${urlApiTwitch}?user_id=${providerAccountId}&description=${marker.title}`, {
        method:'POST',
        headers
    });
    
    const data = await respStream.json();
    const live = data.status;
    
    const position_seconds = data.data[0].position_seconds;
    if (live !== 404){
      if(isStartMarker){
        const markerUpdated = await db.marker.update({
            where: {userId, id: marker.id},
            data: {
                status:'RECORDING',
                starts_at: position_seconds
            }
        })
        return { markerUpdated }
      }else{
        const markerUpdated = await db.marker.update({
            where: {userId, id: marker.id},
            data: {
                status:'RECORDED',
                ends_at: position_seconds
            }
        })
        return { markerUpdated }
      }
    }
    return {data}
});
