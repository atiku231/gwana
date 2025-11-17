import React from 'react';
import type { AppProps } from '@/src/system/types';
import { ChatUI } from '@/src/components/ChatUI';

/**
 * Chat Application - Main conversational interface
 * Uses the existing ChatUI component with system services integration
 */
const ChatApp: React.FC<AppProps> = ({ 
  appId, 
  systemServices, 
  initialIntent, 
  onNavigate, 
  isActive 
}) => {
  // The ChatUI is rendered by the parent App.tsx during transition
  // This component serves as the app entry point and will eventually
  // contain the full chat logic with systemServices integration
  
  // Future: Move chat state management here
  // Future: Handle SHARE, VIEW intents from other apps
  // Future: Use systemServices.ai.sendMessage() instead of direct imports
  
  return null;
};

export default ChatApp;
