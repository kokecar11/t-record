import { $, component$, useOnDocument, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik'
import cn from 'classnames'
import { utcToZonedTime } from 'date-fns-tz'
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    startOfMonth,
    startOfToday,
  } from 'date-fns'

import { Icon, IconCatalog } from '../icon/icon'

import { type FiltersMarkerState } from '~/routes/(app)/dashboard'
import { type MarkerDate } from '~/models'


export enum DatePickerSize {
  xs = 'xs',
  sm = 'sm',
  base = 'base',
  lg = 'lg',
}

const Sizes: Record<DatePickerSize, string> = {
  [DatePickerSize.xs]: 'py-1 px-2 text-xs font-semibold h-6',
  [DatePickerSize.sm]: 'py-1.5 px-3 text-sm font-semibold h-8',
  [DatePickerSize.base]: 'py-2 px-4 text-md font-semibold h-10',
  [DatePickerSize.lg]: 'py-3 px-5 text-base font-semibold h-12',
}

const SizesOnlyIcon: Record<DatePickerSize, string> = {
  [DatePickerSize.xs]: 'w-6 h-6',
  [DatePickerSize.sm]: 'w-8 h-8',
  [DatePickerSize.base]: 'w-10 h-10 text-lg',
  [DatePickerSize.lg]: 'w-12 h-12',
}

export enum DatePickerVariant {
  primary = 'primary',
}

const Variants: Record<DatePickerVariant, string> = {
  [DatePickerVariant.primary]: 'bg-primary border border-slate-600 hover:border hover:border-slate-500 hover:bg-opacity-90 text-white',
}

export type DatePickerProps = {
  size?: DatePickerSize
  variant?: DatePickerVariant
  isOnlyIcon?: boolean
  isSquare?: boolean
  isFullWidth?: boolean
  isDisabled?: boolean
  markers?: MarkerDate[]
  filters: FiltersMarkerState
  classNames?: string
}


export default component$(({ 
  size = DatePickerSize.base,
  variant = DatePickerVariant.primary,
  isOnlyIcon = false,
  isSquare = false,
  isFullWidth = false,
  isDisabled = false,
  classNames = '',
  markers,
  filters,

  }: DatePickerProps) => {
    const timezone = useSignal(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const today = useSignal(startOfToday())
    const currentMonth = useSignal(format(today.value, 'MMM-yyyy'))
    const firstDayCurrentMonth = useSignal(startOfMonth(startOfToday()))
    const showDatePicker = useSignal(false)
    const selectRef = useSignal<HTMLElement>()
    const days = useSignal<Date[]>([])

    useVisibleTask$(() => {
      timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
      today.value = utcToZonedTime(startOfToday(), timezone.value)
      firstDayCurrentMonth.value = startOfMonth(utcToZonedTime(startOfToday(), timezone.value))
    })

    useTask$(({track})=> {
      days.value = eachDayOfInterval({
        start: firstDayCurrentMonth.value,
        end: endOfMonth(firstDayCurrentMonth.value),
      })
      track(()=> [days.value, firstDayCurrentMonth.value, currentMonth.value])
    })
    
    const previousMonth = $(() => {
      const firstDayPreviousMonth = add(firstDayCurrentMonth.value, { months: -1 })
      currentMonth.value = format(firstDayPreviousMonth, 'MMM-yyyy')
      firstDayCurrentMonth.value = parse(currentMonth.value, 'MMM-yyyy', new Date())
    })
    
    const nextMonth = $(() => {
      const firstDayNextMonth = add(firstDayCurrentMonth.value, { months: 1 })      
      currentMonth.value = format(firstDayNextMonth, 'MMM-yyyy')
      firstDayCurrentMonth.value = parse(currentMonth.value, 'MMM-yyyy', new Date())
    })

    const toggleDatePicker = $(() => {
      showDatePicker.value = !showDatePicker.value
    })

    const selectDay = $((day:Date) => {
      filters.selectDayStream = day
    })
    
    const setSizes = () => {
      if (isOnlyIcon) return SizesOnlyIcon[size]
      return Sizes[size]
    }

  const clasess = {
    container: cn(
      'absolute w-80 z-30 mt-2 mx-auto shadow-lg overflow-hidden bg-primary origin-top-right right-0 rounded-lg',
    ),
    day: cn(
      'flex items-center justify-center h-8 w-8 mx-auto rounded-full'
    ),
    btnArrow: cn(
      '-my-1.5 flex flex-none items-center justify-center p-1.5 text-white hover:text-secondary'
    ),
    button: cn(
      'inline-flex items-center justify-center w-full rounded-lg shadow-sm bg-accent hover:bg-accent hover:bg-opacity-20',
      Variants[variant],
      setSizes(),
      {
          'rounded-lg': !isSquare,
          'w-full': isFullWidth,
          'cursor-default opacity-30': isDisabled,
      },
      classNames
  ),
  }
    
    const colStartClasses = [
        '',
        'col-start-2',
        'col-start-3',
        'col-start-4',
        'col-start-5',
        'col-start-6',
        'col-start-7',
    ]

    useOnDocument('click', $((event)=>{
      if (selectRef.value && !selectRef.value.contains(event.target as Node)) showDatePicker.value = false
    }))

    return (
      <div ref={selectRef} class='relative'>
        <button class={clasess.button} onClick$={toggleDatePicker} type='button'>
          <Icon class='mr-1' name={IconCatalog.feCalendar} />
          {isSameDay(today.value, filters.selectDayStream)? 'Today' : format(filters.selectDayStream, 'dd MMM')}
        </button>
        {showDatePicker.value && (
          <div class={clasess.container}>
            <div class="p-4 w-full">
              <div class="flex items-center justify-between">
                <button
                  type="button"
                  onClick$={previousMonth}
                  class={clasess.btnArrow}
                >
                  <span class="sr-only">Previous month</span>
                  <Icon name={IconCatalog.feArrowLeft} />
                </button>
                <h2 class="font-semibold text-white mx-auto">
                  {currentMonth.value}
                </h2>
                <button
                  type="button"
                  onClick$={nextMonth}
                  class={clasess.btnArrow}
                >
                  <span class="sr-only">Next month</span>
                  <Icon name={IconCatalog.feArrowRight} />                
                </button>
              </div>
              <div class="grid grid-cols-7 mt-4 text-xs leading-6 text-center font-bold text-gray-400">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>
              <div class="grid grid-cols-7 mt-2 text-sm">
                {days.value.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    class={[
                      dayIdx === 0 ? colStartClasses[getDay(day)] : '',
                      'py-1'
                    ]}>
                    <button
                      type="button"
                      onClick$={$(()=>selectDay(day))}
                      class={[
                        clasess.day,
                        { 
                          'text-white': (isEqual(day, filters.selectDayStream)),
                          'text-red-500':(!isEqual(day, filters.selectDayStream) && isToday(day)),
                          'text-gray-50':(!isEqual(day, filters.selectDayStream) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth.value)),
                          'text-gray-400':(!isEqual(day, filters.selectDayStream) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth.value)),
                          'bg-red-500':(isEqual(day, filters.selectDayStream) && isToday(day)),
                          'bg-secondary ':(isEqual(day, filters.selectDayStream) && !isToday(day)),
                          'hover:bg-secondary hover:bg-opacity-80':(!isEqual(day, filters.selectDayStream)),
                          'font-semibold':(isEqual(day, filters.selectDayStream) || isToday(day)),
                        },
                      ]}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {format(day, 'd')}
                      </time>
                    </button>
                    
                    <div class="w-1 h-1 mx-auto items-center mt-1">
                      {markers?.some((marker) => {
                        return isSameDay((marker.stream_date), day)
                      }
                        ) 
                      && (
                        <div class="w-1 h-1 rounded-full bg-secondary"></div>
                      ) }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)