import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Form, type DocumentHead, zod$, z, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { supabaseClient, supabaseServerClient } from "~/core/supabase/supabase";
import { useModal } from '~/core/hooks/use-modal';
import Card from "~/components/card/Card";
import { Input } from "~/components/input/Input";
import Modal from "~/components/modal/Modal";
import MiniDashboard from "~/components/mini-dashboard/Mini-dashboard";
import Button from '~/components/button/Button';
import { Tag } from '~/components/tag/Tag';
import { FeFlag, MdiPlus } from '~/components/icons/icons';
import { useStatusStream } from '~/status_stream/hooks/use-status-stream';
import { useMarkerTwitch } from '~/marker/hooks/use-marker-twitch';
import { AuthSessionContext } from '~/auth/context/auth.context';

/** Form Create TMarker */
export const taskForm = zod$({
  start_title: z.string({
    required_error: "El titulo del marcador de inicio es requerido",
    invalid_type_error: "Title start marker must be a string",
  }).nonempty({
    message: "El titulo del marcador de inicio es requerido",
  }),
  end_title: z.string(),
  stream_date:z.string().transform(str => new Date(str)),
    
  fk_user: z.string()
});

/** routeAction CreateMarker */
export const useCreateMarker = routeAction$(
  async (dataForm, requestEv) => {
    const baseClient = supabaseServerClient(requestEv);
    const { data } = await baseClient.from('MarkerTest').insert(dataForm)
    
    if(data){
      return {
        success: true,
        msg: 'Marcador guardado con exito!.'
      };
    }
    return {
      success: false,
      msg:'No fue posible guardar el marcador.'
    };
},  taskForm);

export const useGetMarkers = routeLoader$(
  async ({cookie}) => {
    const baseClient = supabaseClient();
    const fk_user = cookie.get('fk_user')?.value;
    const {data} = await baseClient.from('MarkerTest').select('*').eq('fk_user', fk_user).order('status');
    return { data };
});

export const useIndicatorsOfTMarkers = routeLoader$(async (requestEv) => {
  const baseClient = supabaseServerClient(requestEv);
  const { data} = await baseClient
  .from('view_indicators_markers')
  .select('*');
  const recordingCount = data?.find(marker => marker.status === 'RECORDING')?.count_status_marker | 0
  const recordedCount = data?.find(marker => marker.status === 'RECORDED')?.count_status_marker | 0
  const unRecordedCount = data?.find(marker => marker.status === 'UNRECORDED')?.count_status_marker | 0
  const totalMarkers = recordingCount + recordedCount + unRecordedCount;

  return {
    totalMarkers,
    recordingCount,
    recordedCount,
    unRecordedCount
  };
});

export const useGetStatusOfStream = routeLoader$( async ({cookie}) => {
  const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const urlApiTwitch = 'https://api.twitch.tv/helix/streams';
  const userProviderToken = cookie.get('user_provider_token')?.value;
  const headers = {
      'Authorization':"Bearer " + userProviderToken,
      'Client-Id': TWITCH_CLIENT_ID
  };
  const resp = await fetch(`${urlApiTwitch}?user_id=827109068`, {
      headers
  });
  const { data } = await resp.json();
  return data;
})

// export const useGetMarkersOfStream = routeLoader$( async ({cookie}) => {
//   const PUBLIC_TWITCH_CLIENT_ID = import.meta.env.PUBLIC_TWITCH_CLIENT_ID;
//   const urlApiTwitch = 'https://api.twitch.tv/helix/streams/markers'
//   const userProviderToken = cookie.get('user_provider_token')?.value;
//   const headers = {
//       'Authorization':"Bearer " + userProviderToken,
//       'Client-Id': PUBLIC_TWITCH_CLIENT_ID
//   };
//   const resp = await fetch(`${urlApiTwitch}?user_id=827109068&video_id=1824322604`, {
//       headers
//   });
//   const data = await resp.json();
//   console.log(data.data[0].videos[0].markers)
// })

export default component$( () => {
  const fk_user = useSignal('');
  
  
  const getMarkers = useGetMarkers();

  const createMarker = useCreateMarker();
  const {userProviderToken} = useStatusStream();

  const getstatusOfStream = useGetStatusOfStream();
  const statusOfStream = getstatusOfStream.value[0];

  const {isVisibleModal, showModal} = useModal();
  
  const authSession = useContext(AuthSessionContext)
  useVisibleTask$(async ({track})=>{
    track(()=> [fk_user.value, isVisibleModal.value,userProviderToken])
    // if (localStorage.getItem('sb-lsncoytitkdmnhvkbtrg-auth-token')){
    //   const data = JSON.parse(localStorage.getItem('sb-lsncoytitkdmnhvkbtrg-auth-token')!)
    //   fk_user.value = data.user.id
    //   userProviderToken. value = data.provider_token;
    // }
  });
   const STATUS_MARKER = Object.freeze({
    RECORDED: 'success',
    RECORDING:'warning',
    UNRECORDED:'danger'
  }) 

  
    return (
        <div class={"flex"}>
          <div class="w-4/5 px-8 py-4 h-screen">
            {getMarkers.value.data?.length > 0 ? 
            (
              <div class={"mx-2 col-span-4 grid gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-4"}>
                {
                  getMarkers.value.data?.map((m) => (
                      <Card key={m.id} streamDate={m.stream_date}>
                        <div q:slot='card-tag' class="flex-1">
                          <Tag text={m.status} size='xs' variant={STATUS_MARKER[m.status]} />
                        </div>
                        <div q:slot='card-content'>
                          <div class="mt-4">
                            <h4 class="text-sm font-medium text-violet-900 dark:text-white">Initial Marker:</h4>
                            <p class="text-violet-900 dark:text-white capitalize ml-2">{m.start_title}</p>
                          </div>
                          <div class="mt-4">
                            <h4 class="text-sm font-medium text-violet-900 dark:text-white">Final Marker:</h4>
                            <p class="text-violet-900 dark:text-white capitalize ml-2">{m.end_title ? m.end_title : `End -> ${m.start_title}`}</p>
                          </div>
                        </div>
                        <div q:slot='card-actions'>
                          <Button class="btn btn-violet text-sm" disabled={m.status === 'RECORDED' ? true: false}>Start</Button>
                          <Button class="btn btn-slate text-sm" disabled={m.status === 'RECORDED' ? true: false}>Finish</Button>
                        </div>
                      </Card>
                  ))
                } 
              </div>
            )
            :
            (            
              <div class="grid place-items-center gap-y-2">
                <h1 class="text-3xl font-bold text-violet-900 dark:text-white">Aún no tienes marcadores para tu Stream, crea un marcador.</h1>
                <Button class="btn-violet flex items-center justify-center" onClick$={showModal}>
                  <MdiPlus class="text-xl mr-1" /> Crear Marcadores
                </Button>
              </div>
            )}


          </div>

          <MiniDashboard>
            <div q:slot='dashboard-actions-top'>
              <Button class="btn-violet flex items-center justify-center mx-auto w-full" onClick$={showModal}>
                <MdiPlus class="text-xl mr-1" /> Crear Marcadores
              </Button>
              <div class="flex items-center mt-4 mb-2">
                <hr class="flex-grow border-violet-900"></hr>
                <h3 class="mx-2 font-bold text-violet-900 dark:text-white">Status Stream</h3>
                <hr class="flex-grow border-violet-900"></hr>
              </div>
              <div class="grid place-items-center space-y-1">
                {statusOfStream && statusOfStream?.title ? 
                  (<span class="text-violet-900 dark:text-white text-sm font-semibold">{statusOfStream?.title}</span>) : 
                  (<span class="text-violet-900 dark:text-white text-sm font-semibold">Sin titulo</span>)
                }
                {statusOfStream && statusOfStream?.type ==='live' ? 
                  (<Tag text='Live' variant='danger'/>) : 
                  (<Tag text='Offline' variant='secondary'/>) 
                }
              </div>
            </div>
          </MiniDashboard>
          
          <Modal isVisible={isVisibleModal.value} onClose={showModal}>
            <h2 q:slot='modal-title' class="text-violet-900 dark:text-white font-bold text-2xl flex place-items-center">
              <FeFlag class="mr-2"/> Crear marcadores
            </h2>
            <div q:slot="modal-content" class={"mx-5"}>
              <Form action={createMarker} onSubmitCompleted$={() => {showModal()}} spaReset >
                <Input name='fk_user' bind:value={fk_user} type='hidden' value={fk_user.value} />
                <Input label='Titulo del marcador de inicio' name='start_title' type='text' placeholder='Titulo del marcador de inicio' value={createMarker.formData?.get('start_title')} />
                {createMarker.value?.fieldErrors?.start_title && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.start_title}</p>}
                
                <Input label='Titulo del marcador de final' name='end_title' type='text' placeholder='Titulo del marcador de final' value={createMarker.formData?.get('end_title')} />
                {createMarker.value?.fieldErrors?.end_title && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.end_title}</p>}
                <Input name='stream_date' label='Fecha del Stream' placeholder='Fecha del Stream' type='datetime-local' value={createMarker.formData?.get('stream_date')}></Input>
                {createMarker.value?.fieldErrors?.stream_date && <p class={"mt-2 p-2 rounded-sm bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.stream_date}</p>}
                <div class={"mt-4"}>
                  <button class={"bg-violet-900 p-3 rounded text-white w-full"} type='submit'>Crear Marker</button>
                </div>
              </Form>
            </div>
          </Modal>
      </div>
    );
});

export const head: DocumentHead = {
    title: 'Markers | T-Record',
    meta: [
      {
        name: 'description',
        content: 'Qwik site description',
      },
    ],
  };
  