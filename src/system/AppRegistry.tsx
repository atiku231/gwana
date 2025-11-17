import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AppManifest, RunningApp } from './types/app.types';
import type { Intent } from './types/intent.types';

interface AppRegistryContextState {
  registeredApps: Map<string, AppManifest>;
  runningApps: Map<string, RunningApp>;
  activeAppId: string | null;
  registerApp: (manifest: AppManifest) => void;
  launchApp: (appId: string, intent?: Intent) => void;
  suspendApp: (appId: string) => void;
  terminateApp: (appId: string) => void;
  setActiveApp: (appId: string | null) => void;
  getActiveApp: () => AppManifest | null;
}

const AppRegistryContext = createContext<AppRegistryContextState | null>(null);

export const useAppRegistry = () => {
  const context = useContext(AppRegistryContext);
  if (!context) {
    throw new Error('useAppRegistry must be used within AppRegistryProvider');
  }
  return context;
};

interface AppRegistryProviderProps {
  children: ReactNode;
  apps: AppManifest[];
  onAppLaunch?: (appId: string, intent?: Intent) => void;
}

export const AppRegistryProvider: React.FC<AppRegistryProviderProps> = ({ 
  children, 
  apps,
  onAppLaunch 
}) => {
  const [registeredApps] = useState<Map<string, AppManifest>>(() => {
    const map = new Map();
    apps.forEach(app => map.set(app.id, app));
    return map;
  });
  
  const [runningApps, setRunningApps] = useState<Map<string, RunningApp>>(new Map());
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  const registerApp = useCallback((manifest: AppManifest) => {
    registeredApps.set(manifest.id, manifest);
  }, [registeredApps]);

  const launchApp = useCallback((appId: string, intent?: Intent) => {
    const manifest = registeredApps.get(appId);
    if (!manifest) {
      console.error(`App ${appId} not found in registry`);
      return;
    }

    setRunningApps(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(appId)) {
        newMap.set(appId, {
          manifest,
          state: 'active',
          lastActive: Date.now(),
        });
      } else {
        const app = newMap.get(appId) as RunningApp;
        app.state = 'active';
        app.lastActive = Date.now();
      }
      return newMap;
    });

    setActiveAppId(appId);
    onAppLaunch?.(appId, intent);
  }, [registeredApps, onAppLaunch]);

  const suspendApp = useCallback((appId: string) => {
    setRunningApps(prev => {
      const newMap = new Map(prev);
      const app = newMap.get(appId) as RunningApp | undefined;
      if (app) {
        app.state = 'suspended';
      }
      return newMap;
    });
  }, []);

  const terminateApp = useCallback((appId: string) => {
    setRunningApps(prev => {
      const newMap = new Map(prev);
      newMap.delete(appId);
      return newMap;
    });
    if (activeAppId === appId) {
      setActiveAppId(null);
    }
  }, [activeAppId]);

  const setActiveApp = useCallback((appId: string | null) => {
    if (appId && runningApps.has(appId)) {
      setRunningApps(prev => {
        const newMap = new Map(prev);
        const app = newMap.get(appId) as RunningApp | undefined;
        if (app) {
          app.state = 'active';
          app.lastActive = Date.now();
        }
        return newMap;
      });
    }
    setActiveAppId(appId);
  }, [runningApps]);

  const getActiveApp = useCallback((): AppManifest | null => {
    if (!activeAppId) return null;
    return registeredApps.get(activeAppId) || null;
  }, [activeAppId, registeredApps]);

  const value: AppRegistryContextState = {
    registeredApps,
    runningApps,
    activeAppId,
    registerApp,
    launchApp,
    suspendApp,
    terminateApp,
    setActiveApp,
    getActiveApp,
  };

  return (
    <AppRegistryContext.Provider value={value}>
      {children}
    </AppRegistryContext.Provider>
  );
};
