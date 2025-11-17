import type { AppManifest } from '@/src/system/types';
import { chatAppManifest } from './chat/manifest';
import { studyAppManifest } from './study/manifest';
import { newsAppManifest } from './news/manifest';
import { quizAppManifest } from './quiz/manifest';
import { debateAppManifest } from './debate/manifest';
import { translatorAppManifest } from './translator/manifest';
import { aiWriterAppManifest } from './ai-writing/manifest';
import { codeHelperAppManifest } from './code-helper/manifest';
import { voiceJournalAppManifest } from './voice-journal/manifest';

export const ALL_APP_MANIFESTS: AppManifest[] = [
  chatAppManifest,
  studyAppManifest,
  newsAppManifest,
  quizAppManifest,
  debateAppManifest,
  translatorAppManifest,
  aiWriterAppManifest,
  codeHelperAppManifest,
  voiceJournalAppManifest,
];

export const getAppManifestById = (id: string): AppManifest | undefined => {
  return ALL_APP_MANIFESTS.find(app => app.id === id);
};

export const getAppManifestByMode = (mode: string): AppManifest | undefined => {
  return ALL_APP_MANIFESTS.find(app => app.mode === mode);
};
