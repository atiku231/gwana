# Application Architecture

This document describes the new modular architecture of the application.

## Folder Structure

```
src/
├── apps/                      # Individual application modules
│   ├── ai-writing/           # AI Writing Assistant
│   │   ├── services/         # Writing-specific services
│   │   └── index.ts          # Public exports
│   ├── code-helper/          # Code Helper
│   │   ├── services/         # Code-specific services
│   │   └── index.ts          # Public exports
│   ├── voice-journal/        # Voice Journal
│   │   ├── services/         # Journal-specific services
│   │   └── index.ts          # Public exports
│   ├── translator/           # Translator Console
│   │   ├── services/         # Translation services
│   │   └── index.ts          # Public exports
│   ├── quiz/                 # Quiz System
│   │   ├── services/         # Quiz services
│   │   └── index.ts          # Public exports
│   ├── debate/               # Debate Stage
│   │   ├── services/         # Debate services
│   │   └── index.ts          # Public exports
│   ├── study-hub/            # Study Hub
│   │   ├── services/         # Study services
│   │   └── index.ts          # Public exports
│   ├── calendar/             # Calendar
│   │   ├── services/         # Calendar AI services
│   │   └── index.ts          # Public exports
│   ├── dashboard/            # Dashboard
│   │   └── index.ts          # Public exports
│   ├── news/                 # News & Radio
│   │   ├── services/         # News services
│   │   └── index.ts          # Public exports
│   ├── admin/                # Admin Dashboard
│   │   └── index.ts          # Public exports
│   ├── settings/             # Settings
│   │   └── index.ts          # Public exports
│   ├── whiteboard/           # Whiteboard
│   │   └── index.ts          # Public exports
│   └── chat/                 # Chat Interface
│       ├── services/         # Chat AI services
│       └── index.ts          # Public exports
├── shared/                    # Shared resources
│   ├── components/           # Shared UI components
│   │   └── index.ts          # Component exports
│   └── services/             # Shared services
│       └── index.ts          # Service exports
├── components/                # Original components (maintained)
├── services/                  # Original services (maintained)
├── styles/                    # Organized CSS
│   ├── variables.css         # CSS variables & theme
│   ├── animations.css        # Animation definitions
│   └── utilities.css         # Utility classes
└── ...
```

## Design Principles

### 1. Modular Organization
- Each application has its own folder under `src/apps/`
- Related components, services, and utilities are co-located
- Clear boundaries between different applications

### 2. Service Isolation
- Each app has its own `services/` directory
- Services are currently re-exported from the main `geminiService`
- Future refactoring can implement app-specific service logic

### 3. Shared Resources
- Common components live in `src/shared/components/`
- Shared services are in `src/shared/services/`
- Reduces duplication across applications

### 4. Backward Compatibility
- Original `src/components/` and `src/services/` directories are maintained
- No breaking changes to existing functionality
- Gradual migration path for future development

## Import Patterns

### Importing from Apps
```typescript
// Import specific app
import { AIWritingAssistant } from '@/src/apps/ai-writing';
import { CodeHelper } from '@/src/apps/code-helper';
import { QuizShowUI } from '@/src/apps/quiz';
```

### Importing Shared Components
```typescript
// Import shared components
import { 
  ErrorBoundary, 
  DeepSpaceBackground,
  Logo 
} from '@/src/shared/components';
```

### Importing Services
```typescript
// Import app-specific services
import { getAssistantResponse } from '@/src/apps/chat/services/chatAIService';

// Import shared services
import { getUserProfile } from '@/src/shared/services';
```

## Benefits

1. **Better Organization**: Related code is grouped together
2. **Easier Navigation**: Clear structure makes it easy to find files
3. **Scalability**: Easy to add new applications
4. **Maintainability**: Changes are localized to specific apps
5. **Code Reusability**: Shared resources prevent duplication
6. **Team Collaboration**: Multiple developers can work on different apps without conflicts

## Future Enhancements

1. **Service Specialization**: Implement app-specific Gemini API wrappers
2. **Component Co-location**: Move app-specific components into app folders
3. **Route-based Code Splitting**: Lazy load apps on demand
4. **Independent Testing**: Test each app in isolation
5. **Plugin Architecture**: Make apps pluggable modules

## Migration Notes

- All imports still work with existing paths
- New structure is additive, not destructive
- Developers can use either old or new import paths
- Gradual migration is recommended over time
