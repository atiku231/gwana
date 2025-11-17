import { lazy } from 'react';
import { Scale } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const debateAppManifest: AppManifest = {
  id: 'debate',
  name: 'Debate',
  mode: 'debate',
  icon: '⚖️',
  iconComponent: Scale,
  permissions: ['AI_ACCESS', 'STORAGE'],
  intentFilters: [
    { action: 'DEBATE', dataType: 'topic/*' },
    { action: 'CREATE', dataType: 'debate/*' },
  ],
  entryPoint: lazy(() => import('./DebateApp')),
};
