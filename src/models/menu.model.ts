export interface NavItemsMenuI {
    name: string;
    route: string;
    icon?: string;
  }
  export interface NavMenuI {
    navs: NavItemsMenuI[]
  }