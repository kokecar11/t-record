import { component$ } from "@builder.io/qwik";

export type IndicatorProps = {
  indicator : {
    title?:string;
    counter?: number;
  }
}


export const Indicator = component$(({indicator}: IndicatorProps) => {
  return (
    <div class="bg-slate-500 p-4 bg-opacity-30 rounded-lg">
        <h2 class="text-xs text-violet-900 dark:text-white font-medium mb-2">{indicator.title}</h2>
        <p class="text-lg font-bold text-violet-800 dark:text-white">
            <span class={"border-l-2 dark:border-violet-700 border-slate-900 mr-2"}></span> {indicator.counter}
        </p>
  </div>
  )
});