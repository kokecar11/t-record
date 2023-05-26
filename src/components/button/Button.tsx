import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import type { QwikIntrinsicElements } from '@builder.io/qwik';
import stylesButton from './Button.css?inline'
export type ButtonProps = QwikIntrinsicElements['button'];

export default component$( (props: ButtonProps) => {
  useStyles$(stylesButton)
    return (
      <button class={"btn"} {...props}>
        <Slot />
      </button>
    );
  }
);