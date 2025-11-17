import { lazy } from 'react';
import { Globe } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const chatAppManifest: AppManifest = {
  id: 'default',
  name: 'General',
  mode: 'default',
  icon: '🌐',
  iconComponent: Globe,
  permissions: ['AI_ACCESS', 'STORAGE', 'WEB_SEARCH', 'FILE_ACCESS'],
  intentFilters: [
    { action: 'VIEW', dataType: 'text/*' },
    { action: 'SHARE', dataType: '*/*' },
  ],
  entryPoint: lazy(() => import('./App')),
};
