# RentSecure Observability Architecture

## Overview

This document describes the production-grade error handling and observability architecture implemented for RentSecure (frontend) and RentSecureBE (backend).

---

## Frontend Architecture

### Directory Structure

```
src/core/observability/
  types/
    index.ts              - Shared TypeScript types
  constants/
    errors.ts             - Error classification codes, messages, thresholds
    performance.ts        - Performance thresholds
    sentry.ts             - Sentry configuration constants
  utils/
    redact.ts             - Sensitive data redaction utilities
    classify.ts           - Error classification helpers
    errorMapping.ts       - Backend error format mapping
  logging/
    index.ts              - Structured logging facade (wraps existing logger)
    business.ts           - Business flow logging
    payment.ts            - Payment-specific logging
    subscription.ts       - Subscription-specific logging
  error/
    ErrorBoundary.tsx     - Global React Error Boundary
    ErrorReporter.ts      - Centralized error reporting
    errorUI/
      ErrorState.tsx       - Generic error state
      OfflineState.tsx     - Offline state
      PermissionDeniedState.tsx - Permission denied state
      NotFoundState.tsx    - Not found state
      ServerErrorState.tsx - Server error state
      MaintenanceState.tsx - Maintenance state
      RetryButton.tsx      - Reusable retry button
      ErrorBanner.tsx      - Top error banner
    index.ts
  monitoring/
    sentry.ts             - Sentry initialization and configuration
    performance.ts        - Performance tracking (screen loads, API durations)
    business.ts           - Business flow monitoring
    index.ts
  network/
    index.ts              - Network monitoring wrapper
    adapter.ts            - NetworkManager adapter
  performance/
    index.ts              - Performance tracking utilities
    apiTiming.ts          - Slow API detection
  tests/
    classify.test.ts
    redact.test.ts
    apiError.test.ts
    auth.test.ts
    retryOffline.test.ts
    monitoring.test.ts
    redactSecurity.test.ts
```

### Data Flow

```
User Action / API Call
       ↓
React Error Boundary (render errors)
       ↓
API Client (axios interceptors)
       ↓
createApiError (error classification)
       ↓
ObservabilityLogger (structured logging)
       ↓
ErrorReporter (centralized reporting)
       ↓
Sentry / Monitoring
```

### Key Design Principles

1. **No duplicate API client**: `src/services/api/apiClient.ts` remains the single source of truth.
2. **No duplicate error boundary**: One `ErrorBoundary` in `core/observability/error/`.
3. **No duplicate logging**: `core/observability/logging/` wraps existing `logger`.
4. **Reuse existing infrastructure**: `networkManager`, `errorHandler`, `authInterceptor`, `refreshTokenManager` are reused.

---

## Error Architecture

### Error Categories

| Category | Severity | Retryable | User Message |
|----------|----------|-----------|--------------|
| NETWORK_ERROR | high | yes | "Unable to connect..." |
| AUTHENTICATION_ERROR | high | no | "Your session has expired..." |
| AUTHORIZATION_ERROR | medium | no | "You do not have permission..." |
| VALIDATION_ERROR | low | no | "Please check the information..." |
| NOT_FOUND | low | no | "The requested resource was not found." |
| CONFLICT | medium | no | "The request could not be completed..." |
| RATE_LIMIT | medium | yes | "Too many requests..." |
| SERVER_ERROR | high | yes | "Something went wrong..." |
| TIMEOUT | high | yes | "The request timed out..." |
| OFFLINE | high | yes | "You appear to be offline..." |
| PAYMENT_ERROR | high | no | "Payment could not be processed..." |
| UPLOAD_ERROR | medium | yes | "Upload failed..." |
| SUBSCRIPTION_ERROR | high | no | "Subscription operation failed..." |
| UNKNOWN_ERROR | medium | no | "An unexpected error occurred..." |

### Error Boundary

- Catches unexpected rendering errors
- Prevents complete app crash
- Reports to Sentry and observabilityLogger
- Shows user-friendly fallback (no stack traces, no internal details)
- Provides "Restart" button

### API Error Mapping

| HTTP Status | Category | Retryable | Action |
|-------------|----------|-----------|--------|
| 400 | VALIDATION_ERROR | no | Show field errors |
| 401 | AUTHENTICATION_ERROR | no | Attempt token refresh |
| 403 | AUTHORIZATION_ERROR | no | Show permission denied |
| 404 | NOT_FOUND | no | Show not found state |
| 409 | CONFLICT | no | Show conflict message |
| 422 | VALIDATION_ERROR | no | Map to field errors |
| 429 | RATE_LIMIT | yes | Wait and retry |
| 500 | SERVER_ERROR | yes | Show generic error |
| 502 | SERVER_ERROR | yes | Show generic error |
| 503 | SERVER_ERROR | yes | Show generic error |
| 504 | SERVER_ERROR | yes | Show generic error |

### 401 Handling

1. Detect expired access token
2. Use `RefreshTokenManager` queue to prevent concurrent refresh
3. Retry original request with new token
4. If refresh fails: clear auth state, redirect to login

### 403 Handling

- Never treated as authentication failure
- Shows permission denied state
- Does not expose backend authorization details

---

## Sentry Integration

### Installation

```bash
npm install @sentry/react-native
```

### Initialization

Sentry is initialized in `Providers.tsx` via `initSentry()`:
- Reads DSN from `EXPO_PUBLIC_SENTRY_DSN` environment variable
- Enabled by `EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true`
- Skips expected 401/403 errors
- Redacts sensitive data before sending
- Does not send development secrets to production monitoring

### What Gets Captured

- Fatal crashes (Error Boundary)
- JavaScript errors
- API failures (except expected 401/403)
- Navigation failures
- Business flow failures (payment, subscription, etc.)

### What Does NOT Get Captured

- Expected 401/403 errors
- Expected network errors (ECONNABORTED, ETIMEDOUT, etc.)
- Canceled requests
- Offline requests

---

## Logging Strategy

### Levels

- DEBUG: Development only, detailed request/response logs
- INFO: Normal operations, business flow events
- WARN: Unexpected but handled situations
- ERROR: Failures that need attention
- FATAL: Critical failures

### Sensitive Data Redaction

Before any log is written or sent to Sentry, the following are redacted:
- Authorization headers
- Cookies
- JWT tokens / refresh tokens
- OTPs
- Passwords
- CVV / card numbers
- Bank account details
- Payment secrets (Razorpay, Cashfree)
- API keys
- Webhook secrets
- Personal documents
- Full sensitive API payloads

### Storage

- In-memory circular buffer (1000 entries max)
- Production: only ERROR level stored internally
- Development: all levels logged to console

---

## Privacy / Redaction Strategy

### Redaction Fields

```typescript
['password', 'token', 'secret', 'access', 'refresh', 'authorization',
 'otp', 'cvv', 'cvv2', 'card_number', 'cardNumber', 'upi',
 'bank_account', 'bankAccount', 'ifsc', 'routing_number',
 'account_number', 'accountNumber', 'pan', 'aadhaar', 'ssn',
 'document', 'file', 'base64', 'private_key', 'privateKey',
 'api_key', 'apiKey', 'webhook_secret', 'webhookSecret',
 'razorpay_secret', 'razorpaySecret', 'cashfree_secret',
 'cashfreeSecret', 'twilio_auth_token', 'fcm_server_key',
 'openai_api_key']
```

### Redaction Headers

```typescript
['authorization', 'cookie', 'x-csrf-token', 'set-cookie', 'proxy-authorization']
```

### Sentry Pre-Send Filter

Before sending events to Sentry:
1. Remove authorization headers from request data
2. Remove sensitive fields from stack trace variables
3. Remove sensitive fields from extra data
4. Remove 401/403 events

---

## Network Monitoring

### Statuses

- online: Connected, good speed
- offline: No connectivity
- slow: 2G/3G cellular

### Events Tracked

- Network status changes
- Network restored
- Network lost
- Slow network detected

### Integration

- Uses `@react-native-community/netinfo`
- Wired into `ApiClient` request interceptors
- Offline mutating requests queued in `requestQueue`
- Queue processed automatically on network restore

---

## Performance Monitoring

### Thresholds

| Metric | Threshold |
|--------|-----------|
| Slow API request | 5000ms |
| Very slow API request | 15000ms |
| Slow upload | 30000ms |
| Slow download | 30000ms |
| Screen load | 2000ms |
| App startup | 5000ms |
| Navigation | 500ms |

### Tracked Metrics

- API request duration
- Screen load time
- App startup time
- Navigation performance
- Image upload duration
- Document upload duration

---

## Request Correlation

### Frontend

- Generates `X-Correlation-ID` on every request
- Generates `requestId` per request
- Reads backend `X-Request-ID` from responses
- Attaches correlation ID to error reports

### Backend

- `RequestIdMiddleware` generates/reads `X-Request-ID`
- `CorrelationIdMiddleware` generates/reads `X-Correlation-ID`
- Request IDs injected into log records
- Both IDs echoed back in response headers

### Important

- If backend does not provide a request ID, the frontend does NOT fabricate one
- Correlation IDs are generated client-side; request IDs are generated server-side

---

## Environment Strategy

### Development

- All log levels to console
- Sentry traces sample rate: 100%
- Detailed error messages in Error Boundary
- Dev web mode: skips hard backend gate

### Staging

- ERROR level logs
- Sentry traces sample rate: 20%
- Generic error messages

### Production

- ERROR level logs only
- Sentry traces sample rate: 10%
- Generic error messages in UI
- No development secrets sent to monitoring

---

## Testing Strategy

### Test Files

- `classify.test.ts` - Error classification logic
- `redact.test.ts` - Sensitive data redaction
- `redactSecurity.test.ts` - Security-focused redaction tests
- `apiError.test.ts` - API error creation and mapping
- `auth.test.ts` - 401/403 handling, token refresh concurrency
- `retryOffline.test.ts` - Retry behavior, offline handling
- `monitoring.test.ts` - Business flow and performance tracking

### Coverage Goals

- Error classification: 100%
- Redaction: 100%
- Error boundary: 100%
- API error mapping: 100%
- 401/403 distinction: 100%

---

## Backend Changes

### Files Added/Modified

1. **`core/infrastructure/middleware/request_id.py`** (NEW)
   - `RequestIdMiddleware`: Generates/reads X-Request-ID
   - `CorrelationIdMiddleware`: Generates/reads X-Correlation-ID
   - `RequestLoggingMiddleware`: Logs every request with timing
   - `RequestIdFilter`: Logging filter for request ID injection

2. **`core/infrastructure/exceptions/exception_handler.py`** (NEW)
   - Custom DRF exception handler
   - Consistent `{"error": {"code", "message", "details", "request_id"}}` envelope
   - Handles 400, 401, 403, 404, 405, 406, 415, 429, 5xx

3. **`core/infrastructure/serializers/error.py`** (NEW)
   - `ErrorPayloadSerializer`
   - `ErrorEnvelopeSerializer`
   - `ValidationErrorDetailSerializer`

4. **`core/views/health.py`** (NEW)
   - `HealthCheckView` - Liveness
   - `ReadinessCheckView` - Readiness (database check)
   - `LivenessCheckView` - Lightweight liveness

5. **`rentsecure_be/settings.py`** (MODIFIED)
   - Added new middleware
   - Added `EXCEPTION_HANDLER`
   - Added structured logging with request ID filter
   - Added conditional Sentry integration

6. **`core/urls.py`** (MODIFIED)
   - Added `/health/`, `/health/readiness/`, `/health/liveness/` endpoints

### Django Commands Required

```bash
# Install sentry-sdk (optional)
pip install sentry-sdk

# Run migrations (if any new models added)
python manage.py migrate

# Verify health endpoints
curl http://localhost:8000/api/health/
curl http://localhost:8000/api/health/readiness/
curl http://localhost:8000/api/health/liveness/
```

### Environment Variables

Add to `.env`:

```env
# Sentry (optional - leave empty to disable)
SENTRY_DSN=

# App version for release tracking
APP_VERSION=1.0.0
```

### Backend Error Response Format

After changes, all API errors return:

```json
{
  "error": {
    "code": "ValidationError",
    "message": "Invalid input data.",
    "details": {
      "email": ["This field is required."],
      "phone": ["Enter a valid phone number."]
    },
    "request_id": "uuid-here"
  }
}
```

### Backend Log Format

```
[2025-01-01 12:00:00] [INFO] [request-id-here] core.views - POST /api/auth/login/ 200 123.4ms
[2025-01-01 12:00:01] [ERROR] [request-id-here] core.views - Unhandled exception: POST /api/test req-id-here ValidationError: Invalid data
```

---

## Quality Checklist

- [x] No duplicate API client
- [x] No duplicate JWT refresh logic (uses `RefreshTokenManager` queue)
- [x] No duplicate error boundary
- [x] No duplicate logging system
- [x] No sensitive information logged
- [x] Sentry integration is production-safe
- [x] Expected 401/403 errors are not treated as crashes
- [x] Offline state is handled correctly
- [x] Backend errors are mapped consistently
- [x] Retry does not cause request loops
- [x] Concurrent token refresh is safe
- [x] Payment errors are handled safely (no card numbers, CVV logged)
- [x] Subscription errors are handled safely
- [x] Strict TypeScript (0 observability errors)
- [x] ESLint passes (no observability-specific errors)
- [x] Prettier passes
- [x] Expo compatibility
- [x] Expo Router compatibility
- [x] React Query compatibility
- [x] Production ready
