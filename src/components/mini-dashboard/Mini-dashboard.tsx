import { type QwikIntrinsicElements, Slot, component$ } from "@builder.io/qwik";

export type IndicatorsProps = QwikIntrinsicElements['div'] & {
  indicators?:{title:string, counter:number}[];
};

export default component$(() => {
    return (
        <div class="hidden md:block w-1/5 px-4 py-4 dark:bg-slate-900 h-screen border-l border-violet-900 border-opacity-90">
          <div class="mb-4">
            <Slot name="dashboard-actions-top"/>
          </div>
          <div class="flex items-center mb-4">
            <hr class="flex-grow border-violet-900"></hr>
            <h3 class="mx-2 font-bold text-violet-900 dark:text-white">Markers Indicators</h3>
            <hr class="flex-grow border-violet-900"></hr>
          </div>
          <div class="mb-4">
            <Slot name="dashboard-indicators"/>
          </div>
          <div class="mb-4">
            
          </div>
      </div>
    );
})