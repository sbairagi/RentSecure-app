# RentSecure Security Audit Report

**Date:** 2026-08-09  
**Auditor:** Kilo (Principal Software Architect / Security Engineer)  
**Scope:** RentSecure (React Native/Expo) + RentSecureBE (Django/DRF)

---

## 1. Executive Summary

Both projects have a solid foundation but contain several security gaps that must be addressed before production deployment. The most critical finding is the **use of MMKV (plaintext by default on web and potentially on some Android configurations) for JWT token storage** instead of Expo SecureStore. Additional high-risk findings include missing HTTPS enforcement, insufficient input validation on deep links, and lack of backend rate limiting on sensitive endpoints.

---

## 2. Existing Authentication Architecture

### Mobile
- JWT-based auth via DRF SimpleJWT
- OTP-first flow (send OTP → verify OTP → get tokens)
- Social auth (Google, Apple) - Apple not configured
- Tokens stored in MMKV (`access_token`, `refresh_token`)
- Refresh token queue implemented in `refreshToken.ts`
- Biometric setup supported via `expo-local-authentication`
- Session timeout: 30 min, Inactivity timeout: 15 min

### Backend
- DRF SimpleJWT with 5-min access token, 35-day refresh token
- Token blacklist enabled
- OTP model with attempt tracking
- Password reset tokens with 1-hour expiry
- Login/Register/OTP endpoints

---

## 3. Token Storage Architecture

### CRITICAL FINDING: Insecure Token Storage

**Current:** Tokens stored in `react-native-mmkv`  
**Risk:** MMKV encrypts data on iOS by default but on Android uses SharedPreferences by default (plaintext unless explicitly configured with encryption). On web, MMKV falls back to localStorage (plaintext). JWT tokens in plaintext storage are trivially extractable on rooted/jailbroken devices or via browser dev tools.

**Required:** Tokens MUST be stored in Expo SecureStore (`expo-secure-store`) which uses Keychain (iOS) and EncryptedSharedPreferences (Android).

### Current Storage Map
| Data | Current Storage | Risk |
|------|----------------|------|
| access_token | MMKV | HIGH - plaintext on Android/web |
| refresh_token | MMKV | HIGH - plaintext on Android/web |
| auth_user | MMKV | MEDIUM - PII in plaintext |
| notifications | MMKV | MEDIUM - notification data |
| cache_* | MMKV | MEDIUM - cached API data |

---

## 4. Token Lifecycle

### Current Implementation
- Short-lived access token (5 min backend)
- Refresh token (35 days backend)
- Concurrent refresh handled via queue in `RefreshTokenManager`
- Logout calls backend + clears local storage
- No token revocation on mobile except logout

### Gaps
- No proactive refresh before expiry (only reactive on 401)
- No secure storage migration path
- Refresh token rotation not verified on backend

---

## 5. Authorization Architecture

### Backend
- Django Groups for roles: owner, renter, caretaker, user
- DRF `IsAuthenticated` permission class used extensively
- Some object-level permissions in visitors app
- Bootstrap endpoint returns user role + permissions

### Frontend
- Route guards (`AuthGuard`, `RouteGuard`, `PermissionGuard`)
- Role-based tab access
- Feature-level permission checks

### CRITICAL GAP
Frontend guards are UX-only. Backend must enforce all permissions.

---

## 6. API Security

### Current
- Axios with interceptors
- Correlation IDs, device ID, app version headers
- Retry logic with exponential backoff
- Request queuing for offline
- Error redaction in logger

### Gaps
- **No HTTPS enforcement** in production - app allows HTTP
- No certificate pinning
- No timeout configuration per environment
- API URL logged in environment.ts console.log

---

## 7. Deep-Link Security

### Current
- Custom scheme: `rentsecure://`
- Universal links: `https://app.rentsecureapp.com`
- Deep links parsed for payment, invitation, agreement, rent-record
- Deep links can contain `token`, `id`, `action` parameters

### CRITICAL GAP
Deep links are trusted as navigation commands. No backend validation of resource IDs from deep links. Payment tokens in URLs are not validated server-side before navigation.

---

## 8. File Security

### Backend
- FileField/ImageField with upload_to paths
- File hash deduplication
- No explicit file type validation
- No file size limits in view layer

### Frontend
- Upload service uses `expo-file-system`
- No client-side file type/size validation before upload

### GAP
No backend file upload size/type validation in views. Frontend has no validation.

---

## 9. Payment Security

### Backend
- Razorpay for rent payments (HMAC webhook verification)
- Cashfree for payouts (HMAC webhook verification)
- Payment callback endpoints are CSRF exempt
- Razorpay key/secret in settings

### Frontend
- Payment links created by backend
- No payment secrets in mobile code

### GAP
Payment verification happens backend-side (good). However, no explicit timeout/retry handling for payment verification.

---

## 10. Notification Security

### Current
- Push notifications via `expo-notifications`
- Notification routing based on title/message patterns
- Notification payloads stored in MMKV

### GAP
Notification payloads may contain sensitive data. No server-side sanitization of notification content before delivery.

---

## 11. Logging Security

### Current
- Logger redacts `Authorization` header
- Logger redacts fields: password, token, secret, access, refresh, authorization
- Sentry redacts auth/cookie headers in backend

### GAP
- Logger still logs full request URLs which may contain sensitive IDs
- Development mode logs everything
- No PII redaction in mobile logs

---

## 12. Sensitive-Data Storage

### Current
- User profile (including phone, email) in MMKV
- Notifications in MMKV
- API cache in MMKV

### GAP
Sensitive user data cached in plaintext MMKV. No automatic encryption or secure storage for PII.

---

## 13. Dependency Security

### Current
- Expo SDK 57
- React Native 0.86
- React 19
- axios 1.7.9
- zod 3.24.1

### GAP
No dependency audit in CI. Some packages may have known vulnerabilities.

---

## 14. Configuration Security

### Current
- `.env` files for different environments
- `app.config.js` reads from `.env` and sets `extra`
- Production API URL is HTTPS

### GAP
- `SENTRY_AUTH_TOKEN` and other server-only keys in `.env.example`
- `google-services.json` referenced in app config but not in `.gitignore`
- Environment variables with `EXPO_PUBLIC_` prefix are bundled into app (expected, but must not contain secrets)

---

## 15. Missing Controls

1. **No HTTPS enforcement** in production mobile app
2. **No certificate pinning** (documented as not implemented)
3. **No rate limiting on mobile** (backend has basic OTP rate limit only)
4. **No input sanitization** for deep link parameters
5. **No file upload validation** on mobile
6. **No screenshot protection** for sensitive screens
7. **No clipboard audit** for sensitive data
8. **No WebView security** (not currently used)
9. **No dependency vulnerability scanning** in mobile CI
10. **No secure storage migration** from MMKV to SecureStore

---

## 16. High-Risk Findings

### CRITICAL

| # | Finding | Location | Impact |
|---|---------|----------|--------|
| C-1 | JWT tokens in MMKV (potentially plaintext) | `src/store/authStore.ts`, `src/services/api/apiClient.ts` | Token theft on rooted devices / web |
| C-2 | No HTTPS enforcement | `src/config/environment.ts` | MITM attacks on production API |
| C-3 | Deep links trusted without backend validation | `src/navigation/deepLinking.ts` | Unauthorized resource access |

### HIGH

| # | Finding | Location | Impact |
|---|---------|----------|--------|
| H-1 | API URL logged in console | `src/config/environment.ts` | Information disclosure |
| H-2 | Notification data in plaintext MMKV | `src/store/notificationStore.ts` | PII exposure |
| H-3 | No file type/size validation before upload | `src/services/api/uploadService.ts` | Malicious file upload |
| H-4 | Backend rate limiting only on OTP, not login/payment | `core/views.py` | Brute force / DoS |
| H-5 | Debug logging enabled in production builds | `src/services/api/logger.ts` | Sensitive data leakage |

### MEDIUM

| # | Finding | Location | Impact |
|---|---------|----------|--------|
| M-1 | Jailbreak detection broken (checks SecureStore key) | `src/utils/security.ts` | False sense of security |
| M-2 | No proactive token refresh | `src/services/api/refreshToken.ts` | Brief auth failures |
| M-3 | No PII redaction in mobile logs | `src/services/api/logger.ts` | Privacy violation |
| M-4 | `authInterceptor.ts` still exported but unused | `src/services/api/index.ts` | Code confusion / maintenance risk |

### LOW

| # | Finding | Location | Impact |
|---|---------|----------|--------|
| L-1 | QR scanner is stub implementation | `src/app/(drawer)/(tabs)/visitors/qr-scanner.tsx` | Incomplete feature |
| L-2 | No dependency audit in CI | `package.json` | Unpatched vulnerabilities |

---

## 17. Recommended Remediation

### CRITICAL (Immediate)

1. **Migrate token storage to Expo SecureStore**
   - Create unified `SecureStorageService` that uses SecureStore for tokens
   - Migrate existing tokens from MMKV on app start
   - Deprecate MMKV for sensitive data

2. **Enforce HTTPS in production**
   - Add URL validation in `environment.ts` to reject HTTP URLs when `APP_ENV=production`
   - Block requests to non-HTTPS endpoints in API client

3. **Validate deep links through backend**
   - Never trust resource IDs from URLs
   - Fetch authoritative data from backend after navigation
   - Validate payment tokens server-side before showing payment screen

### HIGH (Before Production)

4. Remove API URL from console.log
5. Encrypt notification cache or move sensitive notifications to SecureStore
6. Add file validation (type, size) before upload
7. Add backend rate limiting on login, password reset, payment endpoints
8. Disable debug logging in production builds

### MEDIUM (Next Sprint)

9. Fix jailbreak detection implementation
10. Implement proactive token refresh
11. Add PII redaction to mobile logger
12. Remove unused `authInterceptor.ts`

### LOW (Backlog)

13. Complete QR scanner implementation with security validation
14. Add mobile dependency audit to CI

---

## 18. Backend Security Findings

### Positive Findings
- SimpleJWT with short access token lifetime (5 min)
- Token blacklist enabled
- HMAC webhook verification for Razorpay and Cashfree
- Security headers configured (HSTS, SSL redirect, etc.)
- Sentry redaction of auth headers
- OTP rate limiting implemented
- Password validators configured

### Gaps
- No DRF throttling classes configured globally
- CORS allows all origins in DEBUG (expected for dev, but should be explicit)
- No rate limiting on login endpoint
- No file upload validation in document views
- No audit logging for sensitive operations (password change, subscription change)

---

## 19. Frontend Security Findings

### Positive Findings
- Existing refresh token queue prevents concurrent refresh
- Authorization header redaction in logger
- Correlation IDs for request tracing
- Network monitoring and request queuing
- Role-based route guards

### Gaps
- Token storage in MMKV (not SecureStore)
- No HTTPS enforcement
- Deep links not validated through backend
- No file upload validation
- No screenshot protection
- No clipboard security audit
- Debug logging in production

---

## 20. Production Security Checklist

- [ ] Tokens stored in SecureStore (not MMKV)
- [ ] HTTPS enforced in production API URLs
- [ ] Deep links validated through backend
- [ ] Backend rate limiting on all sensitive endpoints
- [ ] File upload validation (type, size) on both client and server
- [ ] Debug logging disabled in production
- [ ] PII redaction in all logs
- [ ] Screenshot protection for sensitive screens (documented limitations)
- [ ] Dependency audit in CI
- [ ] Certificate pinning documented (not implemented without ops plan)
- [ ] Backend audit logging for sensitive operations
- [ ] No secrets in mobile bundle
- [ ] No sensitive data in notification payloads
- [ ] All API errors redacted before user display
