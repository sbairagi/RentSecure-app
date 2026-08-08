# AI Assistant Feature

## Overview

The AI Assistant module provides a chat interface for property owners to interact with their RentSecure data using natural language queries. The AI backend acts as a controlled tool layer that queries existing backend services and returns structured, verified data.

## Architecture

```
React Native (AI Assistant Screen)
      ↓
AI API (/api/ai-assistant/chat/)
      ↓
AI Orchestrator (Backend)
      ↓
Authorized Tool Layer
      ↓
RentSecureBE Services
      ↓
PostgreSQL
```

## Folder Structure

```
features/ai-assistant/
├── screens/
│   └── AIAssistantScreen.tsx    # Main chat screen
├── components/
│   ├── ChatMessage.tsx          # User/AI message bubble
│   ├── ChatInput.tsx            # Message input
│   ├── TypingIndicator.tsx      # Loading state
│   ├── SuggestedQuestions.tsx   # Quick prompts
│   ├── ErrorState.tsx           # Error display
│   ├── EmptyState.tsx           # Empty state
│   ├── UpgradePrompt.tsx        # Subscription upgrade prompt
│   └── ConversationItem.tsx     # Conversation history item
├── hooks/
│   ├── useAIChat.ts             # Chat mutation hook
│   ├── useSuggestedQuestions.ts # Suggested questions query
│   ├── useConversations.ts      # Conversations CRUD
│   └── useAICapabilities.ts     # Insights/features
├── repository/
│   └── aiAssistantRepository.ts # API calls
├── services/
│   └── aiAssistantService.ts    # Business logic
├── store/
│   └── aiAssistantStore.ts      # Zustand state
├── types/
│   ├── ai.ts                    # Core AI types
│   └── conversation.ts          # Conversation types
├── constants/
│   └── aiConstants.ts           # API URLs, limits, messages
├── utils/
│   └── aiHelpers.ts             # Formatting, sanitization
└── tests/
    ├── AIAssistantScreen.test.tsx
    ├── useAIChat.test.ts
    └── aiAssistantService.test.ts
```

## Security Rules

1. **No direct database access** - AI communicates through controlled tool layer only
2. **No arbitrary SQL** - All queries use Django ORM with ownership filters
3. **No arbitrary code execution** - AI cannot execute Python code
4. **Authorization enforced** - Every tool call validates `request.user` ownership
5. **Subscription enforced** - `FeatureEnforcer` gates AI access
6. **Rate limited** - Per-user per-month message limits
7. **Secrets protected** - API keys never sent to frontend

## Phase 1 Scope (Read-Only)

- [x] Chat interface
- [x] Message history
- [x] Suggested questions
- [x] Error handling
- [x] Retry mechanism
- [x] Clear conversation
- [x] Loading/typing states
- [x] Upgrade prompts
- [x] Subscription guards
- [x] Permission guards

## Backend Requirements

The backend must provide:

- `POST /api/ai-assistant/chat/` - Main chat endpoint
- `GET /api/ai-assistant/suggested-questions/` - Suggested questions
- `GET /api/ai-assistant/conversations/` - List conversations
- `POST /api/ai-assistant/conversations/` - Create conversation
- `DELETE /api/ai-assistant/conversations/<id>/` - Delete conversation
- `GET /api/ai-assistant/insights/` - Smart insights

See `AI_ASSISTANT_BACKEND_COMPATIBILITY_REPORT.md` for details.

## Environment Variables

- `ENABLE_OPENAI` - Enable/disable OpenAI integration (default: false)
- `OPENAI_API_KEY` - OpenAI API key (server-side only)

## Testing

```bash
npm test -- --testPathPattern="ai-assistant"
```

## Linting

```bash
npm run lint
```

## Type Checking

```bash
npm run typecheck
```
