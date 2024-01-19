import { component$, useSignal, $, type ButtonHTMLAttributes, useOnDocument, useTask$ } from '@builder.io/qwik'
import cn from 'classnames'

import { Icon, IconCatalog } from '../icon/icon'
import type { StatusMarker } from '@prisma/client'
import type { FiltersMarkerState } from '~/routes/(app)/dashboard'


export enum SelectSize {
    xs = 'xs',
    sm = 'sm',
    base = 'base',
    lg = 'lg',
}

const Sizes: Record<SelectSize, string> = {
    [SelectSize.xs]: 'py-1 px-2 text-xs font-semibold h-6',
    [SelectSize.sm]: 'py-1.5 px-3 text-sm font-semibold h-8',
    [SelectSize.base]: 'py-2 px-4 text-md font-semibold h-10',
    [SelectSize.lg]: 'py-3 px-5 text-base font-semibold h-12',
}

const SizesOnlyIcon: Record<SelectSize, string> = {
    [SelectSize.xs]: 'w-6 h-6',
    [SelectSize.sm]: 'w-8 h-8',
    [SelectSize.base]: 'w-10 h-10 text-lg',
    [SelectSize.lg]: 'w-12 h-12',
}

export enum SelectVariant {
    primary = 'primary',
    // secondary = 'secondary',
}

const Variants: Record<SelectVariant, string> = {
    [SelectVariant.primary]: 'bg-primary border border-slate-600 hover:border hover:border-slate-500 hover:bg-opacity-90 text-white',
    // [SelectVariant.secondary]: 'bg-secondary border border-primary border-opacity-20 hover:border hover:border-primary',
}

export interface SelectProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    size?: SelectSize
    variant?: SelectVariant
    isOnlyIcon?: boolean
    isSquare?: boolean
    isFullWidth?: boolean
    isDisabled?: boolean
    classNames?: string
    options?: SelectOption[]
    placeholder?: string
    isDisplayFirstOption?: boolean
    showClear?: boolean
    selectedValue: FiltersMarkerState
}

export interface SelectOption {
    name: string
    value: string
}

export const Select = component$(({
    size = SelectSize.base,
    variant = SelectVariant.primary,
    isOnlyIcon = false,
    isDisplayFirstOption = false,
    isSquare = false,
    isFullWidth = false,
    isDisabled = false,
    showClear = false,
    classNames = '',
    options = [],
    placeholder = 'Select an option',
    selectedValue
    // ...props
}:SelectProps) => {
    const isOpen = useSignal(false)
    const selectRef = useSignal<HTMLElement>()
    const selectedOption = useSignal<SelectOption>()

    const toggleDropdown = $(() => isOpen.value = !isOpen.value)

    const selectOption = $((option: SelectOption) => {
        selectedOption.value = option
        isOpen.value = false
        selectedValue.status = option.value as StatusMarker

    })

    const clearSelectedOption = $((event:any) => {
        event.stopPropagation()
        if (isDisplayFirstOption) {
            selectedOption.value = options[0]
        } else {
            selectedOption.value = undefined
        }
        selectedValue.status = undefined
    })

    useOnDocument('click', $((event)=>{
        if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
            isOpen.value = false
        }
    }))
    
    useTask$(() => {
        if (isDisplayFirstOption) {
            selectedOption.value = options[0]
        }
    })
    const setSizes = () => {
        if (isOnlyIcon) return SizesOnlyIcon[size]
        return Sizes[size]
    }
    
    const clasess = {
        container: cn(
            'relative inline-block text-left',
        ),
        button: cn(
            'inline-flex items-center justify-center w-full rounded-lg shadow-sm hover:bg-accent hover:bg-opacity-20',
            Variants[variant],
            setSizes(),
            {
                'rounded-lg': !isSquare,
                'w-full': isFullWidth,
                'cursor-default opacity-30': isDisabled,
            },
            classNames
        ),
        options: cn(
            'origin-top-right absolute right-0 mt-2 w-full rounded-lg shadow-lg bg-accent z-20'
        ),
        option: cn(
            'block px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 cursor-pointer'
        ),
    }

    return (
        <div ref={selectRef} class={clasess.container}>
            <div>
                <button type="button" onClick$={toggleDropdown} class={clasess.button}>
                    {selectedOption.value ? selectedOption.value.name : placeholder}
                    {(selectedOption.value && showClear) && <Icon onClick$={clearSelectedOption} class='mx-1 text-md text-white hover:text-opacity-80' name={IconCatalog.feClose}/>}
                    <Icon class='ml-1 text-md' name={IconCatalog.feArrowDown}/>
                </button>
            </div>

            {isOpen.value && (
            <div class={clasess.options}>
                <div class="py-1 max-h-[180px] overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {options.map((option) => (
                        <div key={option.value} onClick$={() => selectOption(option)} class={clasess.option} role="menuitem">{option.name}</div>
                    ))}
                </div>
            </div>
            )}
        </div>
    )
})