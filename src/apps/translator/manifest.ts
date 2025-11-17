import { lazy } from 'react';
import { Languages } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const translatorAppManifest: AppManifest = {
  id: 'translator',
  name: 'Translator',
  mode: 'translator',
  icon: '↔️',
  iconComponent: Languages,
  permissions: ['AI_ACCESS', 'STORAGE'],
  intentFilters: [
    { action: 'TRANSLATE', dataType: 'text/*' },
  ],
  entryPoint: lazy(() => import('./App')),
};
