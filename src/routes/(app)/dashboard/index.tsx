import { $, component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, Form, routeAction$, server$, z, zod$, routeLoader$ } from '@builder.io/qwik-city';

import { type MarkerType, supabase } from '~/core/supabase/supabase';
import { useAuth } from '~/auth/hooks/use-auth';

import type { User } from 'supabase-auth-helpers-qwik';
import type { MarkerStateI } from '~/marker/interfaces/marker';

import Modal from '~/components/modal/Modal';
import Button from '~/components/button/Button';
import MiniDashboard from '~/components/mini-dashboard/Mini-dashboard';
import { Tag } from '~/components/tag/Tag';
import { FeLoop, FePlus, FeTimeline } from '~/components/icons/icons';
import { Indicator } from '~/components/mini-dashboard/indicator/Indicator';
import { Input } from '~/components/input/Input';
import { useModal } from '~/core/hooks/use-modal';
import { Marker } from '~/components/marker/Marker';


export const useCheckAuth = routeLoader$(({cookie, redirect}) => {
  const authCookie = cookie.get('_session');
  //TODO: Check cookies and new session by user
  if (authCookie){
    return;
  }
  redirect(302,'/login')
})

export const taskForm = zod$({
  start_title: z.string({
    required_error: "El titulo del marcador de inicio es requerido",
    invalid_type_error: "Title start marker must be a string",
  }).nonempty({
    message: "El titulo del marcador de inicio es requerido",
  }),
  end_title: z.string().optional(),
  stream_date:z.string().nonempty({
    message:"La fecha del stream es requerida"
  }).transform(str => new Date(str)),
});

export const useCreateMarker = routeAction$(
  async (dataForm, {cookie}) => {
    const user:User =  cookie.get('_user')!.json()
    const insertData = {
      fk_user: user.id,
      ...dataForm
    }
    await supabase.from('MarkerTest').insert(insertData)
    return {
      success: true,
      msg: 'Marcador guardado con exito!.'
    };

},  taskForm);

export const getMarkers = server$(
    async (fkUser) => {
      const { data, error } = await supabase.from('MarkerTest')
      .select('*')
      .eq('fk_user', fkUser)
      .order('status',{ ascending: false });
      
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
        indicators: []
    })
    const streamOfStatus = useStore({
        type: 'offline',
        title: 'Stream not live',
        isLoading: false,
    });
    const createMarker = useCreateMarker();
    const { getAuthSession } = useAuth();
    const { isVisibleModal, showModal } = useModal();

    useVisibleTask$(async ({track}) => {
      const auth = await getAuthSession();
      const stream = await getStatusStream()
      track(()=> [markerList.isLoading, streamOfStatus.isLoading])
      markerList.isLoading = false;
      streamOfStatus.isLoading = false;
      markerList.markers = await getMarkers(auth.user.id);
      markerList.indicators = await getIndicatorsMarkers();
      streamOfStatus.type = stream[0].type
      streamOfStatus.title = stream[0].title
    })

    return (
        <div class={"flex h-screen"}>
            <div class="w-full md:w-4/5 px-8 py-4">

              <div class="md:hidden">
                <div class="flex items-center mb-4">
                  <hr class="flex-grow border-violet-900"></hr>
                  <h3 class="mx-2 font-bold text-violet-900 dark:text-white">Markers Indicators</h3>
                  <hr class="flex-grow border-violet-900"></hr>
                </div>
                <div  class={"grid grid-cols-2 gap-2 mb-4 max-w-lg sm:grid-cols-4 sm:gap-2 mx-2"}>
                  {markerList.indicators.map((indicator) => (
                    <Indicator key={indicator.title} indicator={indicator}/>
                  ))} 
                </div>
              </div>

                {
                  markerList.markers.length > 0 ? (
                  <div class={"mx-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4"}>
                    {
                      markerList.markers.map((m) => (
                        <Marker key={m.id} marker={m} onDelete={$(() => {
                          deleteMarker(m.id)
    
                          streamOfStatus.isLoading = true;
                        })} streamOfStatus={streamOfStatus} />
                      ))
                    }

                  </div>
                  )
                  :
                  (
                    <div class="grid place-items-center gap-y-2">
                        <h1 class="text-3xl font-bold text-violet-900 dark:text-white">You don't have any markers for your stream yet, create a marker.</h1>
                        <Button class="btn-violet flex items-center justify-center" onClick$={showModal}>
                            <FePlus class="text-xl mr-1" /> Create your first marker
                        </Button>
                    </div>
                  )
                }

            </div>
              {/* <Toast variant='info' message='Marcador creado en el Stream' title='Excelente!'/> */}
            <MiniDashboard>
                <div q:slot='dashboard-actions-top'>
                  <Button class="btn-violet flex items-center justify-center mx-auto w-full" onClick$={showModal} >
                    <FePlus class="text-xl mr-1" /> New marker
                  </Button>

                  <div class="flex items-center mt-4 mb-2">
                    <hr class="flex-grow border-violet-900"></hr>
                    <h3 class="mx-2 font-bold text-violet-900 dark:text-white">Status Stream</h3>
                    <hr class="flex-grow border-violet-900"></hr>
                  </div>
                  
                  <div class="grid place-items-center space-y-1">
                    { streamOfStatus.title &&(<span class="text-violet-900 dark:text-white text-sm font-semibold">{streamOfStatus.title}</span>)}
                    {streamOfStatus.type && streamOfStatus.type === 'live' ? 
                      (<Tag text='Live' variant='danger'/>) : 
                      (<Tag text='Offline' variant='secondary'/>) 
                    }
                    <Button class="btn-violet btn-xs flex items-center justify-center mx-auto" onClick$={async () => {
                      const stream = await getStatusStream()
                      streamOfStatus.type = stream[0].type
                      streamOfStatus.title = stream[0].title
                      }}>
                      <FeLoop class="text-xl" />
                    </Button>
                  </div>
                  
                </div>
                <div q:slot='dashboard-indicators'>
                  <div  class={"grid grid-cols-2 gap-4 mb-4"}>
                    {markerList.indicators.map((indicator) => (
                      <Indicator key={indicator.title} indicator={indicator}/>
                    ))} 
                  </div>
                </div>
            </MiniDashboard>
            <Modal isVisible={isVisibleModal.value} onClose={showModal}>
              <h2 q:slot='modal-title' class="text-violet-900 dark:text-white font-bold text-2xl flex place-items-center">
                <FeTimeline class="mr-2"/> New markers
              </h2>
              <div q:slot="modal-content" class={"mx-5"}>
                <Form action={createMarker} onSubmitCompleted$={() => {
                  markerList.isLoading = true
                  if (!createMarker.value?.failed) showModal();
                }}>
                  <Input label='Starting marker title' name='start_title' type='text' placeholder='Starting marker title' value={createMarker.formData?.get('start_title')} />
                  {createMarker.value?.fieldErrors?.start_title && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.start_title}</p>}
                  
                  <Input label='Ending marker title' name='end_title' type='text' placeholder='Ending marker title' value={createMarker.formData?.get('end_title')} />
                  {createMarker.value?.fieldErrors?.end_title && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.end_title}</p>}
                  <Input name='stream_date' label='Stream date' placeholder='Stream date' type='datetime-local' value={createMarker.formData?.get('stream_date')}></Input>
                  {createMarker.value?.fieldErrors?.stream_date && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.stream_date}</p>}
                  <div class={"mt-4"}>
                    <button class={"bg-violet-900 p-3 rounded-lg text-white w-full"} type='submit'>Save</button>
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
      content: 'Qwik site description',
    },
  ],
};