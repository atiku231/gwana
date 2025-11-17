import { lazy } from 'react';
import { AudioLines } from 'lucide-react';
import type { AppManifest } from '@/src/system/types';

export const voiceJournalAppManifest: AppManifest = {
  id: 'voice-journal',
  name: 'Voice Journal',
  mode: 'voiceJournal',
  icon: '🎙️',
  iconComponent: AudioLines,
  permissions: ['AI_ACCESS', 'MICROPHONE', 'STORAGE'],
  intentFilters: [
    { action: 'CREATE', dataType: 'journal/*' },
  ],
  entryPoint: lazy(() => import('./VoiceJournalApp')),
};
