import { lazy } from 'react';
import { HelpCircle } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const quizAppManifest: AppManifest = {
  id: 'quiz',
  name: 'Quiz',
  mode: 'quiz',
  icon: '❓',
  iconComponent: HelpCircle,
  permissions: ['AI_ACCESS', 'STORAGE'],
  intentFilters: [
    { action: 'QUIZ', dataType: 'test/*' },
    { action: 'CREATE', dataType: 'quiz/*' },
  ],
  entryPoint: lazy(() => import('./QuizApp')),
};
