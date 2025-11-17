# Webzero Too - AI Operating System

A modular AI-powered operating system built with React and powered by Google Gemini AI.

## Architecture

Webzero Too uses a modern app-based architecture where each application is independent and communicates through an intent system, similar to Android.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   
## Features

- **Independent Apps**: Chat, Study, News, Quiz, Debate, Translator, AI Writer, Code Helper, Voice Journal
- **System Services**: AI, Storage, Calendar, Media, Notifications
- **Intent System**: Apps communicate via intents, not direct imports
- **Dependency Injection**: All services injected through SystemServices
