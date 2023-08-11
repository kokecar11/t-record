import { server$ } from "@builder.io/qwik-city";
import { type MarkerType, supabase } from "~/core/supabase/supabase";

export const getMarkers = server$(async (fkUser:string) => {
    const { data, error } = await supabase.from('task').select('*').eq('fk_user', fkUser).order('stream_date',{ ascending: true });
    if (error){
        return [];
    }else{
        return [...data] as MarkerType[];
    }
});

export const deleteMarker = server$(async (idMarker:number) => {
    await supabase.from('task')
    .delete()
    .eq('id', idMarker)
});
