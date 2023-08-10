import { component$, useTask$ } from '@builder.io/qwik'
import { Icon, IconCatalog } from '../icon/icon'
import { Link } from '@builder.io/qwik-city'
import { useCollapse } from './hooks/use-collapse'
import cn from 'classnames'

export interface CollapseProps {
  title: string
  description: string
  isOpen?: boolean
}

export const Collapse = component$(
  ({ title, description, isOpen }: CollapseProps) => {
    const { isOpenCollapse, showCollapse } = useCollapse()
    useTask$(() => {
      if (isOpen) isOpenCollapse.value = true
    })

    const classes = {
      content: cn('mt-1 transition-all overflow-hidden max-h-fit', {
        'h-36': isOpenCollapse.value,
        'h-0': !isOpenCollapse.value,
      }),
    }

    return (
      <div
        class="cursor-pointer border group border-secondary border-opacity-30 bg-accent p-4 rounded-lg hover:bg-opacity-50 focus:bg-opacity-50"
        onClick$={showCollapse}
      >
        <div class="text-left text-2xl font-bold flex items-start justify-between">
          <span>{title}</span>
          <Link class="rounded-lg p-1 cursor-pointer transition duration-150 ease-in-out group-hover:bg-primary">
            <Icon
              name={IconCatalog.feArrowDown}
              class={` animate-duration-300  delay-75 transition-transform ${
                isOpenCollapse.value ? '-rotate-180' : 'rotate-0 '
              }`}
            />
          </Link>
        </div>
        <div class={classes.content}>
          <p>{description}</p>
        </div>
      </div>
    )
  },
)
