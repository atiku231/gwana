// App entry point
export { default as TranslatorApp } from './TranslatorApp';
export { translatorAppManifest } from './manifest';

// Legacy component exports (during transition)
export { default as TranslatorConsole } from '../../components/TranslatorConsole';
export * from './services/translatorService';
