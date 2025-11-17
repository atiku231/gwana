// App entry point
export { default as CodeHelperApp } from './CodeHelperApp';
export { codeHelperAppManifest } from './manifest';

// Legacy component exports (during transition)
export { default as CodeHelper } from '../../components/CodeHelper';
export * from './services/codeService';
