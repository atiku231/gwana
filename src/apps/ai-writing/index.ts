// App entry point
export { default as AIWriterApp } from './AIWriterApp';
export { aiWriterAppManifest } from './manifest';

// Legacy component exports (during transition)
export { default as AIWritingAssistant } from '../../components/AIWritingAssistant';
export * from './services/writingService';
