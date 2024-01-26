import { $, Resource, component$, useContext, useResource$, useSignal, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik'
import { Form, routeAction$, z, zod$} from '@builder.io/qwik-city'
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city'
import { startOfToday } from 'date-fns'

import { LiveStreamContext } from '~/context'
import { createMarker, deleteMarker, getAllMarkers, getMarkers } from '~/services'

import type { Marker as MarkerList , Session, StatusMarker } from '@prisma/client'
import type { MarkerDate } from '~/models'

import { useModal } from '~/components/modal/hooks/use-modal'
import { useToast } from '~/components/toast/hooks/use-toast'

import Modal from '~/components/modal/Modal'
import Button, { ButtonVariant } from '~/components/button/Button'
import { Input } from '~/components/input/Input'
import { Marker } from '~/components/marker/Marker'
import { Icon, IconCatalog } from '~/components/icon/icon'
import { Loader } from '~/components/loader/Loader'
import { useAuthSession } from '~/routes/plugin@auth'

import { Select, type SelectOption, SelectVariant } from '~/components/select/Select'
import Datepicker from '~/components/datepicker/Datepicker'
import { utcToZonedTime } from 'date-fns-tz'



export const onRequest: RequestHandler = async(event) => {
  const session: Session | null = event.sharedMap.get('session')
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(302, `/`)
  }
}

export const taskForm = zod$({
  title: z.string().nonempty({
    message: "The title of the marker is required"
  }),
  stream_date: z.string().nonempty({
    message:"The date of the stream is required"
  }).transform(str => new Date(str)),
  userId: z.string(),
})

export const instantMarkerForm = zod$({
  desc_marker: z.string({
    required_error: "La descripción del marcador es requerida.",
    invalid_type_error: "Title start marker must be a string",
  })
})

export const useCreateMarker = routeAction$(
  async (dataForm) => {
    const resp = await createMarker(dataForm)
    if(!resp){
      return {
        success: false,
        msg: 'Task could not be saved'
      }  
    }
    return {
      success: true,
      msg: 'Task successfully saved!'
    };

},  taskForm)

export type OrderByMarker = 'stream_date'| 'created_at' | 'status'

export interface FiltersMarkerState {
  selectDayStream: Date
  status : StatusMarker | undefined
}
export default component$(() => {
    const timezone = useSignal(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const session = useAuthSession()
    const createMarker = useCreateMarker()
    const { isVisibleModal, showModal } = useModal()
    const { setToast, Toasts } = useToast()

    const live = useContext(LiveStreamContext)
    
    const markersList = useSignal<MarkerList[]>([])
    const optionsFilterStatus = useSignal<SelectOption[]>([
      {name:'Unrecorded', value:'UNRECORDED'},
      {name:'Recorded', value:'RECORDED'},
      {name:'Recording', value:'RECORDING'},
    ])
    const loadingMarkers = useSignal<boolean>(false)    
    const allMarkersDate = useSignal<MarkerDate[]>([])    
    const filtersMarkers = useStore<FiltersMarkerState>({
      selectDayStream: startOfToday(),
      status: undefined
    })
    
    useVisibleTask$(() => {
      timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
      filtersMarkers.selectDayStream = utcToZonedTime(startOfToday(), timezone.value)
    })

    useTask$(async () => {
      markersList.value = await getMarkers(session.value?.userId as string, filtersMarkers)
    })

    const markersResource = useResource$(async ({track, cleanup}) => {
      const filters = track(filtersMarkers)
      track(loadingMarkers)
      const abortController = new AbortController()
      cleanup(() => abortController.abort("cleanup"))
      allMarkersDate.value = await getAllMarkers(session.value?.userId as string)
      markersList.value = await getMarkers(session.value?.userId as string, filters)
      loadingMarkers.value = false
    })

    return (
        <>
          <div class="w-full container px-4 mx-auto py-6 h-full">
            <div class="gap-y-4 sm:flex sm:space-x-4">
              <div class="grid gap-y-4 sm:flex sm:flex-1 sm:space-x-4">
                <Button onClick$={showModal} variant={ButtonVariant.secondary}>
                  <Icon name={IconCatalog.fePlus} class="mr-1" /> New marker
                </Button>                  
              </div>
              <div class="flex justify-center items-center space-x-4 mt-4 sm:m-0">
                <Datepicker markers={allMarkersDate.value} filters={filtersMarkers} />
                <Select variant={SelectVariant.primary} options={optionsFilterStatus.value} 
                  placeholder='Filter by status'
                  showClear
                  selectedValue={filtersMarkers}
                  />
              </div>
            </div>
                  {
                    <Resource value={markersResource}
                    onPending={() => <Loader />}
                    onResolved={() => markersList.value.length > 0 ? (
                      <>
                        <div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 md:my-6 md:gap-6 lg:grid-cols-4">
                          {
                            markersList.value.map((m) => (
                              <Marker key={m.id} marker={m} onDelete={$(() => {
                                deleteMarker(m.id)
                                live.isLoading = true
                                setToast({message:'Task has been deleted', variant:'info'})
                              })} live={live}/>
                            ))
                          }
                        </div>
                      </>
                      ): 
                      (
                        <div class="flex items-center justify-center mt-4 h-full">
                          <div class="space-y-4"> 
                            <h1 class="text-3xl font-bold text-white">
                              You don't have any marker for your stream yet, create a marker.
                            </h1>
                          </div>
                        </div>
                      )} />
                  }

          </div>
          <Toasts />
          <Modal isVisible={isVisibleModal} title='New Marker'>
            <h2 q:slot='modal-title' class="text-secondary dark:text-white font-bold text-2xl flex place-items-center">
              New task
            </h2>
            <div q:slot="modal-body" class={"mx-5"}>
              <Form action={createMarker}
              // onSubmit$={async() => {
              //   loadingMarkers.value= true
              // }}
              onSubmitCompleted$={() => {
                if (createMarker.value?.success){
                  showModal();
                  setToast({message:createMarker.value?.msg})
                  loadingMarkers.value = true
                }
              }}
              spaReset
              >
                <Input type="hidden" name='userId' value={session.value?.userId as string}></Input>
                <Input label='Marker title' name='title' type='text' placeholder='Marker title' value={createMarker.formData?.get('title')} />
                {createMarker.value?.fieldErrors?.title && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.title}</p>}

                <Input name='stream_date' label='Stream date' placeholder='Stream date' type='datetime-local' value={createMarker.formData?.get('stream_date')} />
                {createMarker.value?.fieldErrors?.stream_date && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{createMarker.value.fieldErrors?.stream_date}</p>}
                <div class={"mt-6 flex space-x-4"}>
                  <Button variant={ButtonVariant.primary} isFullWidth type='button' onClick$={showModal}>Cancel</Button>
                  <Button variant={ButtonVariant.secondary} isFullWidth type='submit'>Save</Button>
                </div>
              </Form>
            </div>
          </Modal>
      </>
    )
})

export const head: DocumentHead = {
  title: 'Dashboard | T-Record',
  meta: [
    {
      name: 'description',
      content: 'Dashboard T-Record',
    },
  ],
}