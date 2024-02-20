import { $, QRL, Resource, component$, useContext, useResource$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { routeAction$, routeLoader$, z, zod$} from '@builder.io/qwik-city'
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
import { Input as InputComponent } from '~/components/input/Input'
import { Marker } from '~/components/marker/Marker'
import { Icon, IconCatalog } from '~/components/icon/icon'
import { Loader } from '~/components/loader/Loader'
import { useAuthSession } from '~/routes/plugin@auth'

import { Select, type SelectOption, SelectVariant } from '~/components/select/Select'
import Datepicker from '~/components/datepicker/Datepicker'
import { utcToZonedTime } from 'date-fns-tz'
import { InitialValues, SubmitHandler, formAction$, reset, useForm, valiForm$ } from '@modular-forms/qwik'
import { type Input, minLength, object, string, date } from 'valibot';


const MarkerTaskSchema = object({
  title: string([
    minLength(1, 'Please enter your title.'),
  ]),
  stream_date: string(),
  userId: string(),
});

type MarkerTaskForm = Input<typeof MarkerTaskSchema>;

export const onRequest: RequestHandler = async(event) => {
  const session: Session | null = event.sharedMap.get('session')
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(302, `/`)
  }
}

export const useFormLoader = routeLoader$<InitialValues<MarkerTaskForm>>(() => ({
  title: '',
  stream_date: new Date().toString(),
  userId: ''
}));

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
    const { isVisibleModal, showModal } = useModal()
    const { setToast, Toasts } = useToast()

    const live = useContext(LiveStreamContext)
    
    const markersList = useSignal<MarkerList[]>([])
    const optionsFilterStatus = useSignal<SelectOption[]>([
      {name:'Unrecorded', value:'UNRECORDED'},
      {name:'Recorded', value:'RECORDED'},
      {name:'Recording', value:'RECORDING'},
    ])
    
    const isSaved = useSignal(false)
    const isAddedNewMarker = useSignal(false)
    const allMarkersDate = useSignal<MarkerDate[]>([])    
    const filtersMarkers = useStore<FiltersMarkerState>({
      selectDayStream: startOfToday(),
      status: undefined
    })

    const [markerTaskForm, { Form, Field }] = useForm<MarkerTaskForm>({
      loader: useFormLoader(),
      validate: valiForm$(MarkerTaskSchema),
    });
  
    useVisibleTask$(() => {
      timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
      filtersMarkers.selectDayStream = utcToZonedTime(startOfToday(), timezone.value)
    })


    const markersResource = useResource$(async ({track, cleanup}) => {
      const filters = track(filtersMarkers)
      track(isAddedNewMarker)
      const abortController = new AbortController()
      cleanup(() => abortController.abort("cleanup"))
      allMarkersDate.value = await getAllMarkers(session.value?.userId as string)
      return await getMarkers(session.value?.userId as string, filters)
    })

    const handleSubmit: QRL<SubmitHandler<MarkerTaskForm>> = $(async (values, event) => {
      isSaved.value = true
      const data = {
        title: values.title,
        stream_date: utcToZonedTime(values.stream_date, timezone.value),
        userId: session.value?.userId as string
      }
      
      const resp = await createMarker(data)
      
      if(!resp){
        setToast({message:'Task could not be saved', variant:'danger'})
        return {
          success: false,
          msg: 'Task could not be saved'
        }  
      }
      isAddedNewMarker.value = !isAddedNewMarker.value
      reset(markerTaskForm)
      setToast({message:'Task successfully saved!', variant:'success'})
      showModal()
      isSaved.value = false
      return {
        success: true,
        msg: 'Task successfully saved!'
      }
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
                <Resource 
                value={markersResource}
                onPending={() => <Loader />}
                onResolved={(markers) => markers.length > 0 ? (
                  <>
                    <div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 md:my-6 md:gap-6 lg:grid-cols-4">
                      {
                        markers.map((m) => (
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
              <Form onSubmit$={handleSubmit}>
                
                <Field name='userId' type='string'>
                  {(field, props) => (
                    <InputComponent {...props} type='hidden' name='userId' value={field.value} />
                  )}
                </Field>

                <Field name='title' type='string'>
                  {(field, props) => (
                    <div>
                      <InputComponent {...props } label='Marker title' name='title' type='text' placeholder='Marker title' value={field.value} />
                      {field.error && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{field.error}</p>}
                    </div>
                  )}
                </Field>

                <Field name='stream_date'>
                  {(field, props) => (
                    <div>
                      <InputComponent {...props} name='stream_date' label='Stream date' placeholder='Stream date' type='datetime-local' value={field.value} />
                      {field.error && <p class={"mt-2 p-2 rounded-lg bg-red-100 text-red-500"}>{field.error}</p>}
                    </div>
                  )}
                </Field>
              
                <div class={"mt-6 flex space-x-4"}>
                  <Button variant={ButtonVariant.primary} isFullWidth type='button' onClick$={showModal}>Cancel</Button>
                  <Button variant={ButtonVariant.secondary} disabled={isSaved.value} isFullWidth type='submit'>Save</Button>
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