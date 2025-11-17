import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import type { SystemServices } from './types/system.types';
import type { Message, Settings, AiMode, Persona, CallState, UserProfile } from '@/src/lib/types';
import { 
  AIServiceImpl, 
  StorageServiceImpl, 
  CalendarServiceImpl,
  MediaServiceImpl,
  NotificationServiceImpl,
  ContactsServiceImpl,
  PermissionServiceImpl,
  IntentManagerImpl
} from './services';

interface ServiceContainerProps {
  children: ReactNode;
  // Pass in state getters and setters
  getMessages: () => Message[];
  getSettings: () => Settings;
  getAiMode: () => AiMode;
  getPersona: () => Persona;
  getCallState: () => CallState;
  getCurrentUser: () => UserProfile | null;
  setAiMode: (mode: AiMode) => void;
  setPersona: (persona: Persona) => void;
  updateSettings: (key: keyof Settings, value: any) => void;
  setToastMessage: (message: string) => void;
  onIntentNavigation: (appId: string, intent?: any) => void;
}

const SystemServicesContext = createContext<SystemServices | null>(null);

export const useSystemServices = () => {
  const context = useContext(SystemServicesContext);
  if (!context) {
    throw new Error('useSystemServices must be used within ServiceContainer');
  }
  return context;
};

export const ServiceContainer: React.FC<ServiceContainerProps> = ({
  children,
  getMessages,
  getSettings,
  getAiMode,
  getPersona,
  getCallState,
  getCurrentUser,
  setAiMode,
  setPersona,
  updateSettings,
  setToastMessage,
  onIntentNavigation,
}) => {
  const systemServices = useMemo<SystemServices>(() => {
    const intentManager = new IntentManagerImpl(onIntentNavigation);
    
    return {
      ai: new AIServiceImpl(),
      storage: new StorageServiceImpl(),
      media: new MediaServiceImpl(),
      notification: new NotificationServiceImpl(),
      contacts: new ContactsServiceImpl(),
      calendar: new CalendarServiceImpl(),
      permissions: new PermissionServiceImpl(),
      intentManager,
      getMessages,
      getSettings,
      getAiMode,
      getPersona,
      getCallState,
      getCurrentUser,
      setAiMode,
      setPersona,
      updateSettings,
      setToastMessage,
    };
  }, [
    getMessages,
    getSettings,
    getAiMode,
    getPersona,
    getCallState,
    getCurrentUser,
    setAiMode,
    setPersona,
    updateSettings,
    setToastMessage,
    onIntentNavigation,
  ]);

  return (
    <SystemServicesContext.Provider value={systemServices}>
      {children}
    </SystemServicesContext.Provider>
  );
};
