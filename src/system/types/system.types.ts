import type { 
  Message, 
  Settings, 
  AiMode, 
  Persona, 
  CallState,
  CalendarEvent,
  NewsArticle,
  StudyHubItem,
  StudyProgress,
  Flashcard,
  UserProfile,
  CallRecord,
  Workflow
} from '@/src/lib/types';
import type { Intent } from './intent.types';

// AI Service Interface
export interface AIService {
  sendMessage: (text: string, context?: any) => Promise<any>;
  generateSpeech: (text: string, voiceName: string) => Promise<any>;
  generateImage: (prompt: string) => Promise<any>;
  startVoiceCall: (config: any) => Promise<any>;
  endVoiceCall: () => void;
  translateText: (text: string, targetLang: string) => Promise<string>;
}

// Storage Service Interface
export interface StorageService {
  get: <T>(key: string, defaultValue?: T) => Promise<T>;
  set: (key: string, value: any) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// Media Service Interface
export interface MediaService {
  playAudio: (url: string) => Promise<void>;
  pauseAudio: () => void;
  stopAudio: () => void;
  recordAudio: () => Promise<Blob>;
  stopRecording: () => void;
}

// Notification Service Interface
export interface NotificationService {
  show: (title: string, message: string) => void;
  dismiss: (id: string) => void;
}

// Contacts Service Interface (placeholder)
export interface ContactsService {
  getAll: () => Promise<any[]>;
  getById: (id: string) => Promise<any>;
  create: (contact: any) => Promise<any>;
  update: (id: string, contact: any) => Promise<any>;
  delete: (id: string) => Promise<void>;
}

// Calendar Service Interface
export interface CalendarService {
  getEvents: () => Promise<CalendarEvent[]>;
  addEvent: (event: CalendarEvent) => Promise<CalendarEvent>;
  deleteEvent: (eventId: string) => Promise<void>;
  generateSuggestion: (event: CalendarEvent) => Promise<any>;
}

// Permissions Service Interface
export interface PermissionService {
  request: (permission: string) => Promise<boolean>;
  check: (permission: string) => Promise<boolean>;
  revoke: (permission: string) => Promise<void>;
}

// Intent Manager Interface
export interface IntentManager {
  sendIntent: (intent: Intent) => void;
  registerHandler: (appId: string, handler: (intent: Intent) => void) => void;
  unregisterHandler: (appId: string) => void;
}

// System Services (Dependency Injection Container)
export interface SystemServices {
  ai: AIService;
  storage: StorageService;
  media: MediaService;
  notification: NotificationService;
  contacts: ContactsService;
  calendar: CalendarService;
  permissions: PermissionService;
  intentManager: IntentManager;
  // Getters for system state
  getMessages: () => Message[];
  getSettings: () => Settings;
  getAiMode: () => AiMode;
  getPersona: () => Persona;
  getCallState: () => CallState;
  getCurrentUser: () => UserProfile | null;
  // Setters for system state
  setAiMode: (mode: AiMode) => void;
  setPersona: (persona: Persona) => void;
  updateSettings: (key: keyof Settings, value: any) => void;
  setToastMessage: (message: string) => void;
}
