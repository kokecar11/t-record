import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";


export const FooterTag = component$(() => {
  return (
    <Link target="_blank" class="bg-secondary hover:bg-opacity-90 bottom-0 right-0 fixed text-white px-3 py-1 rounded-tl-lg cursor-pointer font-semibold" href="https://twitter.com/Kokecar11">
        By @Kokecar11
    </Link>
  );
});