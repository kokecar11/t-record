import { server$ } from "@builder.io/qwik-city"
import { db } from "~/db"
import { type Marker } from "@prisma/client"

import {type FiltersMarkerState } from "~/routes/(app)/dashboard"


export const getMarkers = server$(async (userId:string, filters:FiltersMarkerState) => {
    const tomorrow = new Date(filters.selectDayStream)
    const markers = await db.marker.findMany({
        where: { 
            userId,
            status: filters.byStatus[0],
            stream_date: {
                gte: new Date(filters.selectDayStream),
                lte: new Date(tomorrow.setDate(tomorrow.getDate()+1))
            }
        },
    })
    return markers
})

export const getAllMarkers = server$(async (userId:string) => {
    const markers = await db.marker.findMany({
        where: { 
            userId
        }
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

export const setVODInMarker = server$(async function( isStartMarker:boolean = true, marker:Marker, userId:string ) {
    const TWITCH_CLIENT_ID = this.env.get('TWITCH_ID')
    const urlApiTwitch = 'https://api.twitch.tv/helix/videos';

    const account = await db.account.findFirst({
        where: { userId }
    })

    const accesTokenProvider = account?.access_token as string
    const providerAccountId = account?.providerAccountId as string
    
    const headers = {
        'Authorization':"Bearer " + accesTokenProvider,
        'Client-Id': TWITCH_CLIENT_ID
    };
    const respStream = await fetch(`${urlApiTwitch}?user_id=${providerAccountId}&type=archive&sort=time`, {
        method:'GET',
        headers
    });

    const { data } = await respStream.json() as {data: {id:string}[]}
    if(data.length > 0){
        if(isStartMarker){
            const markerUpdated = await db.marker.update({
                where: {userId, id: marker.id},
                data: {
                    videoIdStreamStart: data[0].id
                }
            })
            return {markerUpdated}
        }else{
            const markerUpdated = await db.marker.update({
                where: {userId, id: marker.id},
                data: {
                    videoIdStreamEnd: data[0].id
                }
            })
            return {markerUpdated}
        }
    }

    return {
        title:'VOD Not ready.',
        message: 'Stream markers aren’t available during the first few seconds of a stream. Wait a few seconds and try again.'
    }
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
    
    const resp = await respStream.json()
    const live = resp.status
    if (live !== 404){
        const position_seconds = resp.data[0].position_seconds
        if(isStartMarker){
            const markerUpdated = await db.marker.update({
                where: {userId, id: marker.id},
                data: {
                    status:'RECORDING',
                    starts_at: position_seconds,
                }
            })
            return { markerUpdated }
        }else{
            const markerUpdated = await db.marker.update({
                where: {userId, id: marker.id},
                data: {
                    status:'RECORDED',
                    ends_at: position_seconds,
                }
            })
            return { markerUpdated }
        }
    }

    return {
        title:'VOD Not ready.',
        message: 'Stream markers aren’t available during the first few seconds of a stream. Wait a few seconds and try again.'
    }
});
