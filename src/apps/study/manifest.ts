import { lazy } from 'react';
import { BookOpen } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const studyAppManifest: AppManifest = {
  id: 'study',
  name: 'Study',
  mode: 'study',
  icon: '🎓',
  iconComponent: BookOpen,
  permissions: ['AI_ACCESS', 'STORAGE', 'FILE_ACCESS'],
  intentFilters: [
    { action: 'STUDY', dataType: 'document/*' },
    { action: 'CREATE', dataType: 'flashcard/*' },
  ],
  entryPoint: lazy(() => import('./App')),
};
