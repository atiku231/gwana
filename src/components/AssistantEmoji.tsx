import React from 'react';
import type { Persona } from '@/src/lib/types';

interface AssistantEmojiProps {
  persona: Persona;
}

export const AssistantEmoji: React.FC<AssistantEmojiProps> = ({ persona }) => {
  return (
    <span className="inline-block">
      {persona === 'Agent Zara' ? '👩‍💼' : '👨‍💼'}
    </span>
  );
};

export default AssistantEmoji;
