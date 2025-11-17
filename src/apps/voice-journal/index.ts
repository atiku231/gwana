// App entry point
export { default as VoiceJournalApp } from './VoiceJournalApp';
export { voiceJournalAppManifest } from './manifest';

// Legacy component exports (during transition)
export { default as VoiceJournal } from '../../components/VoiceJournal';
export * from './services/journalService';
