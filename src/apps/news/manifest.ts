import { lazy } from 'react';
import { Newspaper } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const newsAppManifest: AppManifest = {
  id: 'news',
  name: 'News',
  mode: 'news',
  icon: '📰',
  iconComponent: Newspaper,
  permissions: ['AI_ACCESS', 'WEB_SEARCH', 'STORAGE'],
  intentFilters: [
    { action: 'NEWS', dataType: 'article/*' },
    { action: 'VIEW', dataType: 'news/*' },
  ],
  entryPoint: lazy(() => import('./NewsApp')),
};
