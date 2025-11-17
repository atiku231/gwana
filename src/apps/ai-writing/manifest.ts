import { lazy } from 'react';
import { PenTool } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const aiWriterAppManifest: AppManifest = {
  id: 'ai-writer',
  name: 'AI Writer',
  mode: 'aiWriter',
  icon: '✍️',
  iconComponent: PenTool,
  permissions: ['AI_ACCESS', 'STORAGE'],
  intentFilters: [
    { action: 'CREATE', dataType: 'text/*' },
  ],
  entryPoint: lazy(() => import('./AIWriterApp')),
};
