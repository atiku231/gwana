import { lazy } from 'react';
import { Code } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const codeHelperAppManifest: AppManifest = {
  id: 'code-helper',
  name: 'Code Helper',
  mode: 'codeHelper',
  icon: '💻',
  iconComponent: Code,
  permissions: ['AI_ACCESS', 'STORAGE'],
  intentFilters: [
    { action: 'CREATE', dataType: 'code/*' },
  ],
  entryPoint: lazy(() => import('./CodeHelperApp')),
};
