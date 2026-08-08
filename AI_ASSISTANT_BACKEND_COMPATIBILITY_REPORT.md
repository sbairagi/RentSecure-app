# Backend AI Compatibility Report — RentSecureBE AI Assistant

## Executive Summary

The RentSecureBE backend contains **two partially implemented AI-related Django apps**: `ai_assistant` and `smartbot`. Both have view functions and services but are **NOT registered in `INSTALLED_APPS`** and **NOT wired into the main URL configuration**. The `smartbot` app directly calls the OpenAI API without a controlled tool/function layer, violating the AI security requirements. There is **no production-ready AI API** exposed to the frontend.

The frontend must be built to:
1. Call a new, controlled AI API that does not yet exist on the backend.
2. Work within existing backend capabilities for read-only data queries.
3. Respect subscription limits and permissions enforced by the backend.

---

## 1. Existing AI-Related Django Apps

### 1.1 `ai_assistant` App

**Location:** `RentSecureBE/ai_assistant/`

**Status:** EXISTS but NOT in `INSTALLED_APPS` and NOT in `urls.py`.

**Views:**

| View Function | Method | Endpoint (if wired) | Description |
|---------------|--------|---------------------|-------------|
| `ai_assistant_insights` | GET | `/api/ai-assistant/insights/` | Returns smart insights: total rent this month, late rent count, payout success rate, missing agreements, missing police verifications, upcoming tax dues |
| `rent_analytics_data` | GET | `/api/ai-assistant/rent-analytics/` | Returns monthly rent data, paid/unpaid totals for charts |
| `financial_health_report` | GET | `/api/ai-assistant/financial-health/` | Returns financial health analysis (rent score, tax score, suggestions) |
| `chat_with_assistant` | POST | `/api/ai-assistant/chat/` | Accepts `message`, calls `handle_chat_message`, returns AI response |

**Services:**

| Service | File | Description |
|---------|------|-------------|
| `analyze_financial_health` | `services/finance_ai.py` | Analyzes rent and tax records, returns scores and suggestions |
| `archive_renter_data` | `services/archive_service.py` | Archives renter data |
| `translate_msg` | `services/i18n_service.py` | Translates messages using Google Translator |
| `generate_final_invoice_pdf` | `services/invoice_service.py` | Generates PDF invoices |
| `update_unit_status` | `services/unit_service.py` | Updates unit status based on renter presence |

**Models:** Empty (`models.py` has no fields).

**Tests:** `tests/test_services.py` covers `serialize_value`, `archive_renter_data`, `analyze_financial_health`, `translate_msg`, `generate_final_invoice_pdf`, `update_unit_status`.

### 1.2 `smartbot` App

**Location:** `RentSecureBE/smartbot/`

**Status:** EXISTS, in `INSTALLED_APPS`, but NOT in main `urls.py`.

**Views:**

| View Function | Method | Endpoint (if wired) | Description |
|---------------|--------|---------------------|-------------|
| `smart_bot_reply` | POST | `/api/smartbot/reply/` | Accepts `query`, builds context from rent records and chat history, calls OpenAI, detects intents, executes actions (send_rent_reminder, retry_payout, send_rent_agreement, send_agreement_for_signature) |

**Services:**

| Service | File | Description |
|---------|------|-------------|
| `gpt_smart_reply` | `services/gpt_services.py` | Direct OpenAI ChatCompletion call with user context |
| `send_rent_reminder` | `actions.py` | Sends WhatsApp rent reminder to renter |
| `retry_payout` | `actions.py` | Retries CashFree payout |
| `send_rent_agreement` | `actions.py` | Generates and sends agreement PDF via WhatsApp |
| `send_agreement_for_signature` | `actions.py` | Sends agreement for e-signature via Leegality |
| `extract_intent` | `intents.py` | Simple keyword-based intent extraction |
| `generate_agreement_pdf` | `services/agreement_service.py` | Generates agreement PDF |
| `initiate_signature` | `services/leegality_service.py` | Leegality e-signature integration |
| `send_whatsapp_message` | `whatsapp_service.py` | WhatsApp message sending |

**Models:**

| Model | Description |
|-------|-------------|
| `SmartBotChat` | Stores user messages and bot replies |

**Tests:** `tests.py` contains integration tests.

### 1.3 Critical Security Issues in Existing AI Code

1. **Direct OpenAI API Access:** `smartbot/services/gpt_services.py` calls `openai.ChatCompletion.create()` directly with user context. The OpenAI API key is stored in `settings.OPENAI_API_KEY`.
2. **No Controlled Tool Layer:** `smart_bot_reply` passes raw database context to GPT and allows GPT to trigger side effects (sending WhatsApp, retrying payouts, sending agreements) based on simple keyword matching.
3. **No Subscription Gating:** Neither `ai_assistant` nor `smartbot` views check `FeatureEnforcer` or subscription status.
4. **No Rate Limiting:** No rate limiting on AI endpoints.
5. **Data Leakage Risk:** Context data sent to GPT includes renter names, phone numbers, rent amounts, and payment statuses.
6. **No Conversation Isolation:** `SmartBotChat` stores all chats but doesn't enforce per-user conversation boundaries.

---

## 2. Backend APIs Available for AI Tool Layer

### 2.1 Read-Only Data APIs (Suitable for AI Tools)

| API Endpoint | Method | Description | Owner-Scoped |
|--------------|--------|-------------|--------------|
| `/api/buildings/` | GET | List buildings | Yes (`owner` filter) |
| `/api/units/` | GET | List units | Yes (`owner` filter) |
| `/api/renters/` | GET | List renters | Yes (`unit__owner` filter) |
| `/api/rent-records/` | GET | List rent records | Yes (`unit__owner` filter) |
| `/api/extra-charges/` | GET | List extra charges | Yes |
| `/api/police-verifications/` | GET | List police verifications | Yes |
| `/properties/owner/dashboard/` | GET | Comprehensive owner dashboard | Yes |
| `/properties/owner/dashboard-summary/` | GET | Owner dashboard summary | Yes |
| `/properties/owner/rent-records/` | GET | Owner rent records | Yes |
| `/properties/owner/rents/` | GET | Owner rent overview | Yes |
| `/properties/owner/income-summary/` | GET | Owner income summary | Yes |
| `/api/subscription-plans/` | GET | List subscription plans | Public-ish |
| `/api/user-subscriptions/` | GET | Current user subscription | Yes |
| `/api/usage-limits/` | GET | Current usage limits | Yes |
| `/api/notifications/get/` | GET | List notifications | Yes |

### 2.2 Write APIs (NOT Suitable for Phase 1 AI)

| API Endpoint | Method | Description | Risk |
|--------------|--------|-------------|------|
| `/api/rent-records/` | POST | Create rent record | Financial |
| `/api/rent-records/<id>/` | PATCH/PUT | Update rent record | Financial |
| `/api/renters/` | POST | Create renter | Data mutation |
| `/api/renters/<id>/` | PATCH/PUT/DELETE | Modify/delete renter | Data mutation |
| `/api/visitors/<id>/approve/` | POST | Approve visitor | Security |
| `/api/visitors/<id>/reject/` | POST | Reject visitor | Security |
| `/api/subscription-plans/` | POST | Create plan | Admin |
| `/api/user-subscriptions/<id>/upgrade/` | POST | Upgrade subscription | Financial |
| `/api/user-subscriptions/<id>/cancel/` | POST | Cancel subscription | Financial |

---

## 3. Existing AI Capabilities (Backend-Side)

### 3.1 What Exists

1. **Financial Health Analysis:** `ai_assistant/services/finance_ai.py` - `analyze_financial_health()` computes rent_score, tax_score, and overall_score with suggestions.
2. **Rent Analytics:** `ai_assistant/views.py` - `rent_analytics_data()` returns monthly rent trends.
3. **Smart Insights:** `ai_assistant/views.py` - `ai_assistant_insights()` returns aggregated metrics.
4. **GPT Integration:** `smartbot/services/gpt_services.py` - Direct OpenAI integration exists but is NOT wired into the main API.
5. **Translation:** `ai_assistant/services/i18n_service.py` - Google Translate integration.
6. **PDF Generation:** `ai_assistant/services/invoice_service.py` - WeasyPrint PDF generation.

### 3.2 What Does NOT Exist

1. **Controlled Tool/Function Layer:** No structured tool invocation system. The `smartbot` sends raw context to GPT and parses text responses for actions.
2. **Conversation Persistence API:** `SmartBotChat` model exists but has no REST endpoint for CRUD operations.
3. **AI Rate Limiting:** No rate limiting on AI endpoints.
4. **AI Subscription Gating:** No `FeatureEnforcer` integration for AI features.
5. **AI Permission Scoping:** No explicit permission checks beyond `IsAuthenticated`.
6. **Structured Tool Results:** AI responses are free-form text, not structured data with source references.
7. **Error Handling for AI Failures:** No standardized error handling for OpenAI API failures.
8. **AI Configuration Management:** No environment-based AI configuration (model selection, temperature, max tokens, system prompts).
9. **Conversation Management API:** No endpoints for listing, deleting, or paginating conversations.

---

## 4. Authentication and Authorization

### 4.1 Authentication

- **Method:** JWT (SimpleJWT) with refresh tokens.
- **Middleware:** `AuthenticationMiddleware` + `SimpleJWT` token validation.
- **Frontend:** Stores tokens in `expo-secure-store`, sends via `Authorization: Bearer <token>` header.

### 4.2 Authorization

- **Primary:** Ownership-based (`unit.owner == request.user`, `renter.unit.owner == request.user`).
- **Secondary:** `IsAuthenticated` permission class on all API views.
- **Groups:** `owner`, `renter`, `caretaker`, `ca_partner`, `support_executive`, `super_admin`, `admin`.
- **Frontend:** `PermissionGuard` component checks `FEATURE_PERMISSIONS` and `ROLE_PERMISSIONS` (these are frontend-only, not backed by Django permissions).

### 4.3 AI Authorization Requirements

Every AI request MUST:
1. Validate the JWT token.
2. Confirm the user is authenticated.
3. Scope all data queries to `owner == request.user`.
4. Check `FeatureEnforcer` for AI feature limits.
5. Never expose data from other owners.

---

## 5. Subscription and Feature Enforcement

### 5.1 Existing Feature Enforcement

- **`FeatureEnforcer`** (`properties/feature_enforcer.py`): Single source of truth for plan-based feature gating.
- **`PlanFeatureLimit`** model: Maps `feature_key` to plan limits.
- **`UsageLimit`** model: Tracks current usage per user per feature.
- **`AddOnPurchase`** model: Tracks add-on purchases.
- **Frontend:** `useEffectiveLimits()`, `useSubscription()`, `SubscriptionGuardWrapper`.

### 5.2 AI Feature Keys Required

The following feature keys should be added to `PlanFeatureLimit` for AI:

| Feature Key | Description | Default (Free) | Pro | Elite |
|-------------|-------------|----------------|-----|-------|
| `ai_chat_messages` | Number of AI chat messages per month | 10 | 100 | Unlimited |
| `ai_insights` | Access to AI insights dashboard | False | True | True |

### 5.3 Current State

- No AI feature keys exist in `PlanFeatureLimit`.
- No `UsageLimit` entries for AI features.
- No subscription checks in `ai_assistant` or `smartbot` views.

---

## 6. Data Models Relevant to AI

### 6.1 Core Models

| Model | Fields | Relevance to AI |
|-------|--------|-----------------|
| `User` | `username`, `full_name`, `phone`, `email`, `is_investor` | User identity, ownership |
| `UserProfile` | `whatsapp_number`, `language_preference`, `alert_frequency` | User preferences for AI responses |

### 6.2 Properties Models

| Model | Key Fields | Relevance to AI |
|-------|-----------|-----------------|
| `Building` | `name`, `address_line`, `city`, `state`, `owner` | Building queries |
| `Unit` | `unit`, `unit_type`, `status`, `owner`, `building` | Unit occupancy, vacancy |
| `Renter` | `name`, `phone`, `email`, `rent_amount`, `status`, `unit` | Renter queries, overdue detection |
| `RentRecord` | `amount`, `status`, `due_date`, `paid_on`, `payout_status`, `unit`, `renter` | Rent collection, pending, overdue |
| `PropertyTaxRecord` | `amount`, `due_date`, `paid_date`, `property` | Tax queries |
| `ExtraCharge` | Various | Additional charges |

### 6.3 Finance Models

| Model | Key Fields | Relevance to AI |
|-------|-----------|-----------------|
| `CAPartner` | `name`, `specialization`, `city`, `rating` | CA matchmaking |

---

## 7. Existing Third-Party AI Integrations

### 7.1 OpenAI

- **Status:** Configured in `settings.py` (`OPENAI_API_KEY`, `ENABLE_OPENAI`).
- **Usage:** `smartbot/services/gpt_services.py` - direct `openai.ChatCompletion.create()` calls.
- **Model:** Not explicitly configured; uses OpenAI default.
- **Risk:** API key is server-side only, which is correct. However, the integration lacks:
  - Error handling for API failures
  - Timeout configuration
  - Token usage tracking
  - Fallback behavior when disabled

### 7.2 Google Translate (Deep Translator)

- **Status:** Used in `ai_assistant/services/i18n_service.py`.
- **Usage:** `translate_msg()` for message translation.
- **Risk:** No API key configuration visible; may use free tier or library defaults.

---

## 8. Celery / Background Jobs

### 8.1 Existing Scheduled Tasks

- `send_scheduled_reminders` - Sends rent and tax reminders via WhatsApp.
- `send_extra_charge_reminders` - Sends extra charge reminders.
- `process_rent_reminders()` - Core reminder processing.
- `process_tax_reminders()` - Core tax reminder processing.

### 8.2 AI-Related Background Jobs

- **None.** No background jobs for AI processing, conversation cleanup, or AI report generation.

### 8.3 Required Background Jobs for AI

1. `cleanup_old_conversations` - Delete conversations older than X days.
2. `generate_ai_usage_report` - Monthly AI usage report for admins.
3. `reset_ai_usage_limits` - Reset monthly AI message counters.

---

## 9. Audit / History / Logging

### 9.1 Existing Audit

- **`simple_history`:** Enabled for `User`, `RentRecord`, `Renter`, and other models.
- **`HistoricalRecords`:** Tracks changes to model instances.
- **WhatsApp Logs:** `WhatsAppLog` model tracks message sending.

### 9.2 AI Audit Requirements

- All AI queries must be logged (user, query, timestamp, tools called, response).
- All tool invocations must be logged with parameters and results.
- No sensitive data (passwords, tokens, bank details) should be logged.
- Conversation history must be auditable.

### 9.3 Current State

- `SmartBotChat` model exists but is not audited.
- No AI-specific logging middleware.
- No AI query audit trail.

---

## 10. Rate Limiting

### 10.1 Existing Rate Limiting

- **Django:** No built-in rate limiting on AI views.
- **Frontend:** `retryPolicy.ts` implements exponential backoff for HTTP requests (retryable statuses: 408, 429, 500, 502, 503, 504).
- **DRF:** No throttling classes configured for AI views.

### 10.2 Required Rate Limiting

1. **Per-user AI message limit:** Enforced by `FeatureEnforcer` + `UsageLimit`.
2. **Per-minute rate limit:** Prevent abuse (e.g., 10 messages per minute).
3. **Backoff on 429:** Frontend should respect `Retry-After` header.

---

## 11. Missing Backend Capabilities for Phase 1 AI

### 11.1 Critical Missing Pieces

| Capability | Required | Current State | Impact |
|------------|----------|---------------|--------|
| AI API URL routing | Required | `ai_assistant` and `smartbot` NOT in `urls.py` | Frontend cannot call AI endpoints |
| `ai_assistant` in `INSTALLED_APPS` | Required | Missing | App not loaded |
| `smartbot` in `INSTALLED_APPS` | Required | Present | App loaded but URLs missing |
| Controlled tool layer | Required | None | AI has unrestricted access |
| Subscription gating for AI | Required | None | AI accessible to all users |
| AI conversation CRUD API | Required | `SmartBotChat` exists but no API | No conversation history |
| AI rate limiting | Required | None | Abuse risk |
| AI error handling standardization | Required | None | Poor UX on failures |
| AI configuration management | Required | Hardcoded in `gpt_services.py` | No environment switching |

### 11.2 Data Gaps for AI Queries

| Query Type | Available Data | Gap |
|------------|---------------|-----|
| "How much rent is pending?" | `RentRecord.status = PENDING` | Need aggregation endpoint or client-side filtering |
| "Which renters have overdue rent?" | `RentRecord.due_date < today AND status = PENDING` | Available via rent-records API |
| "Which units are vacant?" | `Unit.status = VACANT` | Available via units API |
| "Which agreements are expiring soon?" | `RentAgreementDraft` | Limited; no expiry tracking API |
| "How much rent was collected this month?" | `RentRecord.status = PAID AND due_date__month = current` | Available via dashboard-summary |
| "Which maintenance requests are still open?" | **No maintenance model** | Not available |
| "Which buildings have the highest occupancy?" | `Unit.status` per building | Available via buildings/units API |
| "How many active renters do I have?" | `Renter.status = ACTIVE` | Available via renters API |

---

## 12. Backend Changes Required

### 12.1 Required Django Changes (Documented, Not Implemented)

1. **Add `ai_assistant` to `INSTALLED_APPS`** in `rentsecure_be/settings.py`.
2. **Include `ai_assistant` URLs** in `rentsecure_be/urls.py`:
   ```python
   path("api/ai-assistant/", include("ai_assistant.urls")),
   ```
3. **Add `ai_assistant` feature keys** to `PlanFeatureLimit` via migration or data migration:
   - `ai_chat_messages`
   - `ai_insights`
4. **Create controlled AI tool layer** in `ai_assistant/services/tools.py`:
   - `get_rent_summary()`
   - `get_pending_rents()`
   - `get_overdue_rents()`
   - `get_occupancy_summary()`
   - `get_vacant_units()`
   - `get_expiring_agreements()`
   - `get_maintenance_summary()` (returns empty with message until backend supports maintenance)
   - `get_payment_summary()`
   - `get_payout_summary()`
   - `get_subscription_status()`
   - `get_notification_summary()`
5. **Create `ai_assistant/urls.py`** with endpoints:
   - `POST /api/ai-assistant/chat/` - Main chat endpoint
   - `GET /api/ai-assistant/conversations/` - List conversations
   - `POST /api/ai-assistant/conversations/` - Create conversation
   - `DELETE /api/ai-assistant/conversations/<id>/` - Delete conversation
   - `GET /api/ai-assistant/insights/` - Smart insights
   - `GET /api/ai-assistant/suggested-questions/` - Suggested questions based on user data
6. **Add `FeatureEnforcer` checks** to all AI views.
7. **Add rate limiting** using Django throttling or custom middleware.
8. **Add AI query logging** middleware or model.
9. **Remove or secure `smartbot`** - either integrate into controlled tool layer or restrict access.
10. **Add `ENABLE_OPENAI` check** in `gpt_services.py` before making API calls.

### 12.2 Backend Changes NOT Required for Phase 1

- No new database tables (reuse `SmartBotChat` or create `Conversation`/`Message` models).
- No new third-party integrations.
- No changes to existing property, renter, or rent record APIs.

---

## 13. Frontend Strategy

### 13.1 Approach

1. **Assume AI API exists:** The frontend will call `/api/ai-assistant/chat/` and related endpoints.
2. **Graceful degradation:** If the AI API returns 404 or 503, show "AI Assistant is currently unavailable" with a retry button.
3. **Subscription guard:** Use existing `SubscriptionGuardWrapper` to block AI access for expired/free-tier users without AI access.
4. **Error handling:** Handle all HTTP error codes (401, 403, 404, 429, 500) with appropriate user messages.
5. **No direct DB access:** Frontend never queries PostgreSQL directly; all data comes through the AI API or existing APIs.

### 13.2 API Contract (Proposed)

#### POST `/api/ai-assistant/chat/`

**Request:**
```json
{
  "message": "How much rent is pending this month?",
  "conversation_id": "uuid-optional",
  "context": {}
}
```

**Response (Success):**
```json
{
  "conversation_id": "uuid",
  "response": "You have ₹25,000 in pending rent this month from 3 renters.",
  "tools_used": ["get_pending_rents"],
  "data": {
    "total_pending": 25000,
    "count": 3,
    "renters": [
      {"name": "John Doe", "unit": "101", "amount": 10000},
      {"name": "Jane Smith", "unit": "102", "amount": 8000},
      {"name": "Bob Johnson", "unit": "103", "amount": 7000}
    ]
  },
  "sources": ["RentRecord"],
  "timestamp": "2026-08-08T07:00:00Z"
}
```

**Response (Error - Rate Limited):**
```json
{
  "error": "rate_limit_exceeded",
  "message": "You have reached your monthly AI message limit. Please upgrade your plan.",
  "retry_after": 3600
}
```

**Response (Error - Unauthorized):**
```json
{
  "error": "unauthorized",
  "message": "Please log in to use AI Assistant."
}
```

#### GET `/api/ai-assistant/suggested-questions/`

**Response:**
```json
{
  "questions": [
    "How much rent is pending this month?",
    "Which renters have overdue rent?",
    "Which units are vacant?",
    "Show me maintenance requests still pending"
  ]
}
```

#### GET `/api/ai-assistant/conversations/`

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Rent inquiry",
      "created_at": "2026-08-08T07:00:00Z",
      "updated_at": "2026-08-08T07:05:00Z",
      "message_count": 4
    }
  ]
}
```

---

## 14. Security Model

### 14.1 Backend Security

1. **No direct DB access from AI model:** All data queries go through controlled tool functions.
2. **No arbitrary SQL:** No raw SQL in AI code.
3. **No arbitrary code execution:** AI cannot execute Python code.
4. **Authorization enforced:** Every tool call validates `request.user` ownership.
5. **Subscription enforced:** `FeatureEnforcer` gates AI access.
6. **Rate limited:** Per-user per-month message limits.
7. **Secrets protected:** API keys never sent to frontend.

### 14.2 Frontend Security

1. **No sensitive data in prompts:** Do not send passwords, tokens, or bank credentials.
2. **Minimal context:** Send only user ID and message to AI API.
3. **No local AI processing:** All AI logic runs on backend.
4. **Secure storage:** Conversation history stored in backend, not locally (unless explicitly cached with user consent).

---

## 15. Privacy Model

1. **Data minimization:** Only send aggregated/anonymized data to AI when possible.
2. **No personal documents:** Do not upload ID proofs, agreements, or bank statements to AI.
3. **IDs over PII:** Prefer renter IDs, unit IDs over names/phone numbers in tool results.
4. **Conversation retention:** Backend should define retention policy (e.g., 90 days).

---

## 16. Testing Strategy

### 16.1 Backend Tests Required

1. **Tool authorization tests:** Verify each tool respects ownership.
2. **Permission tests:** Verify 403 for unauthorized users.
3. **Subscription tests:** Verify AI blocked for expired/free users without AI access.
4. **Rate limit tests:** Verify 429 after limit exceeded.
5. **Tool result tests:** Verify structured output for each tool.
6. **Error handling tests:** Verify graceful handling of OpenAI API failures.

### 16.2 Frontend Tests Required

1. **Component tests:** Chat UI, message bubbles, typing indicator.
2. **Hook tests:** `useAIChat`, `useSuggestedQuestions`, `useConversations`.
3. **Service tests:** API calls, error handling, retry logic.
4. **Permission tests:** Verify AI screen blocked for unauthorized users.
5. **Subscription tests:** Verify upgrade UI shown for restricted users.
6. **No-hallucination tests:** Verify frontend never fabricates data.
7. **Offline tests:** Verify offline state handling.
8. **Error tests:** Verify 401, 403, 404, 429, 500 handling.

---

## 17. Conclusion

The RentSecureBE backend has **foundational AI components** but they are **disconnected, insecure, and incomplete**. The `ai_assistant` app has useful read-only analytics views, and `smartbot` has OpenAI integration, but neither is production-ready for the frontend.

**Recommended Path Forward:**
1. **Backend First:** Implement the controlled tool layer, wire URLs, add subscription gating, and add rate limiting.
2. **Frontend Second:** Build the React Native AI Assistant module against the new API.
3. **Phase 1 (Read-Only):** Launch with read-only tools only. No write capabilities.
4. **Phase 2 (Write with Confirmation):** Add write tools with explicit user confirmation dialogs.

**Backend readiness for Phase 1 frontend:** **NOT READY** — requires Django changes before frontend can consume a stable AI API.
