import { lazy } from 'react';
import { Mic } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const voiceJournalAppManifest: AppManifest = {
  id: 'voice-journal',
  name: 'Voice Journal',
  mode: 'voiceJournal',
  icon: '🎙️',
  iconComponent: Mic,
  permissions: ['AI_ACCESS', 'MICROPHONE', 'STORAGE'],
  intentFilters: [
    { action: 'CREATE', dataType: 'journal/*' },
  ],
  entryPoint: lazy(() => import('./VoiceJournalApp')),
};
