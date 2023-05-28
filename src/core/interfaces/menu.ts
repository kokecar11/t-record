import type { PropFunction } from "@builder.io/qwik";

export interface NavItemsMenuI {
  name: string;
  route: string;
  icon?: string;
}
export interface NavMenuI {
  navs: NavItemsMenuI[]
}
export interface MenuDropdownOptios {
    name: string;
    route?: string;
    action?: PropFunction<() => void>
}