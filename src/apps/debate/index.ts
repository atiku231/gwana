// App entry point
export { default as DebateApp } from './DebateApp';
export { debateAppManifest } from './manifest';

// Legacy component exports (during transition)
export { default as DebateStageUI } from '../../components/DebateStageUI';
export * from './services/debateService';
