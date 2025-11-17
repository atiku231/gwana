import React, { useState, useEffect } from 'react';
import type { AppProps } from '@/src/system/types';
import { ChatUI } from '@/src/components/ChatUI';

const ChatApp: React.FC<AppProps> = ({ appId, systemServices, initialIntent, onNavigate, isActive }) => {
  // This is a wrapper that preserves the existing ChatUI component
  // The actual implementation is managed by the parent App.tsx for now
  // This component serves as the app entry point for the new architecture
  
  return null; // Rendered by parent for now during transition
};

export default ChatApp;
