import React, { LazyExoticComponent, ComponentType, ReactNode } from 'react';
import type { AiMode } from '@/src/lib/types';
import type { SystemServices } from './system.types';
import type { Intent } from './intent.types';

export type Permission = 
  | 'MICROPHONE' 
  | 'CAMERA' 
  | 'CONTACTS' 
  | 'AI_ACCESS' 
  | 'STORAGE' 
  | 'CALENDAR'
  | 'NOTIFICATIONS'
  | 'WEB_SEARCH'
  | 'FILE_ACCESS';

export interface IntentFilter {
  action: string;
  dataType?: string;
}

export interface AppManifest {
  id: string;
  name: string;
  mode: AiMode;
  icon: ReactNode;
  iconComponent: React.ElementType;
  permissions: Permission[];
  intentFilters: IntentFilter[];
  entryPoint: LazyExoticComponent<ComponentType<AppProps>> | ComponentType<AppProps>;
}

export interface AppProps {
  appId: string;
  systemServices: SystemServices;
  initialIntent?: Intent;
  onNavigate: (intent: Intent) => void;
  isActive: boolean;
}

export interface RunningApp {
  manifest: AppManifest;
  state: 'active' | 'suspended' | 'background';
  lastActive: number;
}
