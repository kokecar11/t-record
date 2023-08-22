import { $, useContext } from "@builder.io/qwik";
import { GlobalStore } from "~/context";

import type { ThemePreference } from "~/models";

export const getColorPreference = (): ThemePreference => {
    if (localStorage.getItem('theme-preference')) {
      return localStorage.getItem('theme-preference') as ThemePreference;
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
};
  
export const useToggleTheme = () => {
  
  const state = useContext(GlobalStore);
  const reflectPreference = $((theme: ThemePreference) => {
    document.firstElementChild?.setAttribute('data-theme', theme);
  });

  const setPreference = $((theme: ThemePreference) => {
    localStorage.setItem('theme-preference', theme);
    reflectPreference(theme);
  });

  const handleTheme = $(() => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    setPreference(state.theme);
  });

  return {
    reflectPreference,
    setPreference,
    handleTheme
  }
}