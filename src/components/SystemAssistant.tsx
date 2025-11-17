import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { AssistantEmoji } from './AssistantEmoji';
import type { Persona } from '@/src/lib/types';

interface SystemAssistantProps {
  persona: Persona;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SystemAssistant - Floating assistant chat panel
 * Provides quick help and guidance to users
 */
const SystemAssistant: React.FC<SystemAssistantProps> = ({ persona, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! I\'m here to help you navigate and use all features. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);

    // Simulate AI response (replace with actual AI call)
    setTimeout(() => {
      const response = getSystemResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsThinking(false);
    }, 1000);
  };

  const getSystemResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('quiz')) {
      return 'The Quiz app lets you test your knowledge on any topic! Just select Quiz from the app menu and choose your subject.';
    }
    if (lowerQuery.includes('study') || lowerQuery.includes('flashcard')) {
      return 'The Study app includes flashcards, analytics, and study guides. You can create AI-generated flashcard decks and track your progress!';
    }
    if (lowerQuery.includes('translate')) {
      return 'The Translator app supports real-time translation between multiple languages. Just type or speak your text!';
    }
    if (lowerQuery.includes('debate')) {
      return 'The Debate app lets you watch AI agents debate topics from different perspectives. It\'s great for understanding multiple viewpoints!';
    }
    if (lowerQuery.includes('code') || lowerQuery.includes('programming')) {
      return 'Code Helper can debug, explain, and optimize your code. Just paste your code and ask for help!';
    }
    if (lowerQuery.includes('write') || lowerQuery.includes('writing')) {
      return 'AI Writer helps you generate and edit documents with AI assistance. Perfect for essays, articles, and creative writing!';
    }
    if (lowerQuery.includes('journal')) {
      return 'Voice Journal lets you record audio entries and get AI-powered insights about your thoughts and mood!';
    }
    
    return 'I can help you with quizzes, studying, translation, debates, coding, writing, and journaling. What would you like to explore?';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-card border-2 border-primary/30 rounded-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            <AssistantEmoji persona={persona} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">System Assistant</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          aria-label="Close assistant"
        >
          <X size={20} className="text-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="text-xl flex-shrink-0">
                <AssistantEmoji persona={persona} />
              </div>
            )}
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-2 justify-start">
            <div className="text-xl flex-shrink-0">
              <AssistantEmoji persona={persona} />
            </div>
            <div className="bg-secondary/50 text-foreground p-3 rounded-lg">
              <div className="flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isThinking}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Floating Button Component
export const SystemAssistantButton: React.FC<{
  persona: Persona;
  onClick: () => void;
}> = ({ persona, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 group"
      aria-label="Open system assistant"
    >
      <div className="text-2xl group-hover:scale-110 transition-transform">
        <AssistantEmoji persona={persona} />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
    </button>
  );
};

export default SystemAssistant;
