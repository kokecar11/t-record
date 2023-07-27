import type { PropFunction } from "@builder.io/qwik";
import type { IconCatalog } from "~/components/icon/icon";

export interface NavItemsMenuI {
  name: string;
  route: string;
  icon?: string;
}
export interface NavMenuI {
  navs: NavItemsMenuI[]
}
export interface MenuDropdownOptions {
    name: string;
    route?: string;
    icon?: IconCatalog;
    action?: PropFunction<() => void>
}