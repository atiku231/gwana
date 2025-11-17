import { lazy } from 'react';
import { Code2 } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const codeHelperAppManifest: AppManifest = {
  id: 'code-helper',
  name: 'Code Helper',
  mode: 'code',
  icon: '💻',
  iconComponent: Code2,
  permissions: ['AI_ACCESS', 'STORAGE'],
  intentFilters: [
    { action: 'CREATE', dataType: 'code/*' },
  ],
  entryPoint: lazy(() => import('./CodeHelperApp')),
};
