// App entry point
export { default as ChatApp } from './ChatApp';
export { chatAppManifest } from './manifest';

// Legacy component exports (during transition)
export { ChatUI } from '../../components/ChatUI';
export { default as AnimatedAiMessage } from '../../components/chat/AnimatedAiMessage';
export { default as ChatInput } from '../../components/chat/ChatInput';
export { default as MessageActionsToolbar } from '../../components/chat/MessageActionsToolbar';
export { default as SuggestionChips } from '../../components/chat/SuggestionChips';
export { default as ThinkingIndicator } from '../../components/chat/ThinkingIndicator';
export { default as ToolUseIndicator } from '../../components/chat/ToolUseIndicator';
export * from './services/chatAIService';
