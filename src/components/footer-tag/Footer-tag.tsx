import { component$ } from "@builder.io/qwik";


export const FooterTag = component$(() => {
  return (
    <a target="_blank" class="bg-secondary hover:bg-opacity-90 bottom-0 right-0 fixed text-white px-3 py-1 rounded-tl-lg cursor-pointer font-semibold" href="https://twitter.com/Kokecar11">
        By @Kokecar11
    </a>
  );
});