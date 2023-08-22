
import { createContextId } from '@builder.io/qwik';
import type { SiteStore } from '~/models';

export const GlobalStore = createContextId<SiteStore>('site-store');
