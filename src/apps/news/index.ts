// App entry point
export { default as NewsApp } from './NewsApp';
export { newsAppManifest } from './manifest';

// Legacy component exports (during transition)
export { default as NewsDesk } from '../../components/NewsDesk';
export { default as NewsDisplay } from '../../components/NewsDisplay';
export { default as LiveRadioPlayer } from '../../components/LiveRadioPlayer';
export * from './services/newsService';
