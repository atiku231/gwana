import type { IntentManager } from '../types/system.types';
import type { Intent } from '../types/intent.types';
import type { AppManifest } from '../types/app.types';

export class IntentManagerImpl implements IntentManager {
  private handlers: Map<string, (intent: Intent) => void> = new Map();
  private appRegistry: Map<string, AppManifest> = new Map();
  
  constructor(private onModeChange: (appId: string, intent?: Intent) => void) {}

  setAppRegistry(apps: AppManifest[]) {
    apps.forEach(app => {
      this.appRegistry.set(app.id, app);
    });
  }

  sendIntent(intent: Intent): void {
    // If target app is specified, send directly
    if (intent.targetApp && this.handlers.has(intent.targetApp)) {
      const handler = this.handlers.get(intent.targetApp)!;
      handler(intent);
      this.onModeChange(intent.targetApp, intent);
      return;
    }

    // Otherwise, find app that can handle this intent
    for (const [appId, manifest] of this.appRegistry.entries()) {
      const canHandle = manifest.intentFilters.some(filter => {
        if (filter.action !== intent.action) return false;
        if (filter.dataType && intent.type && !intent.type.match(filter.dataType)) return false;
        return true;
      });

      if (canHandle) {
        const handler = this.handlers.get(appId);
        if (handler) {
          handler(intent);
        }
        this.onModeChange(appId, intent);
        return;
      }
    }

    console.warn('No app found to handle intent:', intent);
  }

  registerHandler(appId: string, handler: (intent: Intent) => void): void {
    this.handlers.set(appId, handler);
  }

  unregisterHandler(appId: string): void {
    this.handlers.delete(appId);
  }
}
