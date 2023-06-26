import { $, component$, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Form, routeAction$, server$, z, zod$ } from '@builder.io/qwik-city';

import { type MarkerType, supabase } from '~/core/supabase/supabase';

import type { User } from 'supabase-auth-helpers-qwik';
import type { MarkerStateI } from '~/marker/interfaces/marker';

import Modal from '~/components/modal/Modal';
import Button from '~/components/button/Button';
import { FeCalendar, FePlus } from '~/components/icons/icons';
import { Input } from '~/components/input/Input';
import { useModal } from '~/core/hooks/use-modal';
import { Marker } from '~/components/marker/Marker';
import { markerStream } from '~/marker/marker';
import {type ProviderI } from '~/core/interfaces/provider';
import { AuthSessionContext } from '~/auth/context/auth.context';
import { useToast } from '~/components/toast/hooks/use-toast';



export const taskForm = zod$({
  start_title: z.string({
    required_error: "El titulo del marcador de inicio es requerido",
    invalid_type_error: "Title start marker must be a string",
  }).nonempty({
    message: "El titulo del marcador de inicio es requerido",
  }),
  end_title: z.string().optional(),
  stream_date: z.string().nonempty({
    message:"La fecha del stream es requerida"
  }).transform(str => new Date(str))
});

export const instantMarkerForm = zod$({
  desc_marker: z.string({
    required_error: "La descripción del marcador es requerida.",
    invalid_type_error: "Title start marker must be a string",
  }).nonempty({
    message: "La descripción del marcador es requerida.",
  }),
});

export const useCreateMarker = routeAction$(
  async (dataForm, {cookie}) => {
    const user:User =  cookie.get('_user')!.json()
    const insertData = {
      fk_user: user.id,
      ...dataForm
    }
    const { error } = await supabase.from('MarkerTest').insert(insertData)
    if(error){
      return {
        success: false,
        msg: 'T-Marker could not be saved'
      }  
    }
    return {
      success: true,
      msg: 'T-Marker successfully saved!'
    };

},  taskForm);

export const useCreateInstantMarker = routeAction$(
  async (dataForm, {cookie}) => {
    const provider:ProviderI = cookie.get('_provider')!.json();
    const user:User =  cookie.get('_user')!.json()
    const responseStream = await markerStream(provider,user, dataForm.desc_marker);
    
    if(responseStream.status === 404){
      return {
        success: false,
        msg: 'Marker could not be created in the stream.'
      };
    }
    return {
      success: true,
      msg: 'Marker successfully created in the stream!'
    };

},  instantMarkerForm);

export const getMarkers = server$(
    async (fkUser) => {
      const { data, error } = await supabase.from('MarkerTest')
      .select('*')
      .eq('fk_user', fkUser)
      .order('stream_date',{ ascending: true });
      
      if (error){
        return [];
      }else{
        return [ ...data  ] as MarkerType[];
      }
});

export const deleteMarker = server$(
  async (idMarker) => {
    await supabase.from('MarkerTest')
    .delete()
    .eq('id', idMarker)
});

export const getIndicatorsMarkers = server$(async function() {
  
  const user:User = this.cookie.get('_user')!.json();

  const { data } = await supabase.from('countstatusperuser').select('*').eq('fk_user',user.id);

  const recordingCount = data?.find(marker => marker.status === 'RECORDING')?.statuscount | 0;
  const recordedCount = data?.find(marker => marker.status === 'RECORDED')?.statuscount | 0;
  const unRecordedCount = data?.find(marker => marker.status === 'UNRECORDED')?.statuscount | 0;
  const totalMarkers = recordingCount + recordedCount + unRecordedCount;
  
  const indicators = [
      {title: 'Total', counter: totalMarkers},
      {title: 'Recording', counter: recordingCount},
      {title: 'Unrecorded', counter: unRecordedCount},
      {title: 'Recorded', counter: recordedCount},
  ];
  
  return indicators
});

export const getStatusStream = server$( async function(){
  const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const urlApiTwitch = 'https://api.twitch.tv/helix/streams';
  const providerToken: { provider_token:string, provider_refresh_token:string } = this.cookie.get('_provider')!.json();
  const user:User = this.cookie.get('_user')!.json();
  const headers = {
      'Authorization':"Bearer " + providerToken.provider_token,
      'Client-Id': TWITCH_CLIENT_ID
  };
  const resp = await fetch(`${urlApiTwitch}?user_id=${user.user_metadata.provider_id}`, {
      headers
  });
  const {data} = (await resp.json()) as {data: {title:string, type:string}[]};
  if (data.length > 0){
    return data;
  }

  return [{
    type: 'offline',
    title:'Stream not live',
  }];
});
  

export default component$(() => {
    const markerList = useStore<MarkerStateI>({
        currentPage: 0,
        markers: [],
        isLoading: false,
        indicators: [
          {title: 'Total',counter: 0},
          {title: 'Recording',counter: 0},
          {title: 'Unrecorded',counter: 0},
          {title: 'Recorded',counter: 0}
        ]
    })
    const streamOfStatus = useStore({
        type: 'offline',
        title: 'Stream not live',
        isLoading: false,
    });
    const createMarker = useCreateMarker();

    const { isVisibleModal, showModal } = useModal();
    const { setToast, Toasts } = useToast();

    const authSession = useContext(AuthSessionContext);

    useVisibleTask$(async ({track}) => {  
      const stream = await getStatusStream();
      track(()=> [markerList.isLoading, streamOfStatus.isLoading])
      markerList.isLoading = false;
      streamOfStatus.isLoading = false;
      markerList.markers = await getMarkers(authSession.value?.user.id);
      markerList.indicators = await getIndicatorsMarkers();
      streamOfStatus.type = stream[0].type;
      streamOfStatus.title = stream[0].title;
    })

    return (
        <div class={"flex mx-2"}>
            <div class="w-full px-8 py-4">
                {
                  markerList.markers.length > 0 ? (
                    <>
                    <div class="flex justify-center space-x-4 sm:justify-end">
                    <Button class="btn-secondary flex items-center justify-center w-full md:w-auto" onClick$={showModal}>
                      <FePlus class="mr-1" /> New task
                    </Button>
                    {/* <Button class="btn-secondary flex items-center justify-center w-full md:w-auto" onClick$={showModal}>
                      <FePlus class="mr-1" /> Instant marker
                    </Button> */}
                    <Button class="btn-accent flex items-center justify-center w-full md:w-auto">
                      <FeCalendar class="mr-1" /> Today
                    </Button>
                  </div>

                  <div class="grid grid-cols-1 gap-2 my-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4">

                    {
                      markerList.markers.map((m) => (
                        <Marker key={m.id} marker={m} onDelete={$(() => {
                          deleteMarker(m.id)
    
                          streamOfStatus.isLoading = true;
                        })} streamOfStatus={streamOfStatus} />
                      ))
                    }

                  </div>
                  </>
                  )
                  :
                  (
                    <div class="flex items-center justify-center h-full">
                      <div class="space-y-4"> 
                        <h1 class="text-3xl font-bold text-violet-900 dark:text-white">
                          You don't have any task for your stream yet, create a task.
                        </h1>
                        <Button class="btn-secondary flex items-center justify-center mx-auto" onClick$={showModal}>
                            <FePlus class="text-xl mr-1" /> Create your first task
                        </Button>
                      </div>
                    </div>
                  )
                }

            </div>
            <Toasts></Toasts>
            <Modal isVisible={isVisibleModal.value} onClose={showModal}>
              <h2 q:slot='modal-title' class="text-violet-900 dark:text-white font-bold text-2xl flex place-items-center">
                New task
              </h2>
              <div q:slot="modal-content" class={"mx-5"}>
                <Form action={createMarker} 
                onSubmitCompleted$={() => {
                   if (!createMarker.value?.failed){
                     showModal();
                     markerList.isLoading = true
                     setToast({message:createMarker.value?.msg})
                  } 
                    
                }}
                spaReset
                >
                  <Input label='Starting marker title' name='start_title' type='text' placeholder='Starting marker title' value={createMarker.formData?.get('start_title')} />
                  {createMarker.value?.fieldErrors?.start_title && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.start_title}</p>}
                  
                  <Input label='Ending marker title' name='end_title' type='text' placeholder='Ending marker title' value={createMarker.formData?.get('end_title')} />
                  {createMarker.value?.fieldErrors?.end_title && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.end_title}</p>}
                  <Input name='stream_date' label='Stream date' placeholder='Stream date' type='date' value={createMarker.formData?.get('stream_date')}></Input>
                  {createMarker.value?.fieldErrors?.stream_date && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.stream_date}</p>}
                  <div class={"mt-4 flex space-x-3"}>
                    {/* <Button class="btn-outlined-secondary w-full" onClick$={showModal}>Cancel</Button> */}
                    <Button class="btn-secondary w-full">Create</Button>
                  </div>
                </Form>
              </div>
            </Modal>
      </div>
    )
});

export const head: DocumentHead = {
  title: 'Dashboard | T-Record',
  meta: [
    {
      name: 'description',
      content: 'Dashboard T-Record',
    },
  ],
};