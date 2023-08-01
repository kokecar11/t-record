import { component$ } from "@builder.io/qwik";

export const Toggle = component$(() => {
  return (
    <div class="flex items-center">
  <label for="toggle" class="mr-4">Monthly</label>
  <div class="relative">
    <input type="checkbox" id="toggle" class="sr-only" />
    <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
    <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
  </div>
  <label for="toggle" class="ml-4">Yearly</label>
</div>
  );
});