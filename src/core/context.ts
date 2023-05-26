
import { createContextId } from '@builder.io/qwik';
import type { ThemePreference } from '~/toggle-theme/interfaces/toggle-theme';

export interface SiteStore {
  theme: ThemePreference;
}

export const GlobalStore = createContextId<SiteStore>('site-store');
