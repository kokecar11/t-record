import { Slot, component$, useStyles$ } from '@builder.io/qwik'
import styleNavbar from './Navbar.css?inline'

export const Navbar = component$(() => {
  useStyles$(styleNavbar)
  return (
    <nav class="navbar">
      <div class="container mx-auto">
        <div class="relative px-4 flex h-16 items-center justify-between">
          <div class="flex flex-1 sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <Slot name="navLogo" />
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <Slot name="navItemsStart" />
              </div>
            </div>
          </div>
          <div class="sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Slot name="navItemsEnd" />
          </div>
        </div>
      </div>
    </nav>
  )
})
