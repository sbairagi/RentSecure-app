# RentSecure Security Module

Production-grade mobile security hardening for the RentSecure React Native/Expo app.

## Structure

```
src/core/security/
├── auth/
│   ├── tokenManager.ts       # Secure token lifecycle management
│   └── session.ts            # Session timeout and inactivity handling
├── constants/
│   └── index.ts              # Security constants and limits
├── device/
│   └── deviceSecurity.ts     # Root/jailbreak/emulator detection
├── index.ts                  # Public API barrel export
├── network/
│   └── httpsEnforcer.ts      # HTTPS enforcement and URL validation
├── permissions/
│   └── roleChecker.ts        # Role-based access control (RBAC)
├── redaction/
│   ├── redactor.ts           # Sensitive data redaction utilities
│   └── sentryRedaction.ts    # Sentry-specific redaction
├── storage/
│   └── secureStorage.ts      # SecureStore-first token storage
├── tests/
│   ├── cryptoUtils.test.ts
│   ├── deepLinkValidator.test.ts
│   ├── httpsEnforcer.test.ts
│   ├── inputSanitizer.test.ts
│   ├── redactor.test.ts
│   ├── roleChecker.test.ts
│   ├── secureStorage.test.ts
│   └── index.ts
├── types/
│   └── index.ts              # Shared security types
├── utils/
│   └── crypto.ts             # Cryptographic utilities
└── validation/
    ├── inputSanitizer.ts     # Input sanitization and validation
    └── urlValidator.ts       # Deep link and URL validation
```

## Key Security Controls

### Token Storage
- **Primary**: Expo SecureStore (Keychain on iOS, EncryptedSharedPreferences on Android)
- **Fallback**: MMKV only when SecureStore is unavailable
- Tokens: `access_token`, `refresh_token`, `auth_user`, session expiry, last activity

### Token Lifecycle
- Short-lived access tokens (backend: 5 minutes)
- Refresh token rotation
- Concurrent refresh protection via queue
- Proactive session expiry and inactivity timeout
- Secure logout with backend token revocation

### HTTPS Enforcement
- Production API URLs must use HTTPS
- Development/localhost HTTP allowed only in debug
- URL validation at config load time

### Data Redaction
- Sensitive field redaction in logs
- Header redaction (Authorization, Cookie, etc.)
- Deep link payload sanitization
- API response redaction before display
- Sentry event sanitization

### Input Validation
- Text sanitization (XSS prevention)
- Email/phone validation
- File type and size validation
- File name sanitization (path traversal prevention)
- Search query validation
- AI prompt validation

### Deep Link Security
- Payload type validation
- Token format validation
- Resource ID validation
- Sensitive parameter detection
- Role-based resource access validation

### Device Security
- Root detection (Android)
- Jailbreak detection (iOS)
- Emulator detection
- Device info collection for backend authorization

### Role-Based Access Control
- Centralized role-permission mapping
- Supports: super_admin, admin, property_owner, caretaker, ca_partner, support_executive, renter, user
- Permission checking: hasPermission, hasAnyPermission, hasAllPermissions
- Feature-level access control

## Usage

```typescript
import {
  secureStorage,
  tokenManager,
  sessionManager,
  HttpsEnforcer,
  Redactor,
  RoleChecker,
  DeviceSecurity,
  DeepLinkValidator,
  InputSanitizer,
  CryptoUtils,
} from '@/core/security';

// Secure token storage
await secureStorage.setAccessToken(token);
const token = await secureStorage.getAccessToken();

// Token refresh
const newToken = await tokenManager.refreshAccessToken();

// Session management
sessionManager.start();
sessionManager.onUserActivity();

// HTTPS validation
const result = HttpsEnforcer.enforceHttps(apiUrl);
if (!result.isValid) throw new Error(result.error);

// Data redaction
const redacted = Redactor.redactObject({ password: 'secret', name: 'John' });

// Role checking
const canAccess = RoleChecker.hasPermission(userRole, 'payment:write');

// Input validation
const email = InputSanitizer.sanitizeEmail('test@example.com');
const fileType = InputSanitizer.validateFileType(file.type, allowedTypes);

// Deep link validation
const validation = DeepLinkValidator.validatePayload(payload);
if (!validation.isValid) throw new Error(validation.error);

// Device security
const deviceResult = await DeviceSecurity.validateDevice();
if (!deviceResult.allowed) throw new Error(deviceResult.reason);

// Cryptographic utilities
const randomString = CryptoUtils.generateRandomString(16);
const numericCode = CryptoUtils.generateNumericCode(6);
```

## Security Principles

1. **Secure by Default**: All security utilities default to safe behavior
2. **Defense in Depth**: Multiple layers of validation and protection
3. **Backend Authority**: Mobile app never trusts client-side state for security
4. **Least Privilege**: Minimal permissions and data access
5. **Fail Secure**: Errors default to denying access, not granting it
6. **No Secrets in Bundle**: All secrets remain on backend

## Testing

```bash
# Run security tests
npm test -- --testPathPattern=core/security

# Run with coverage
npm test -- --testPathPattern=core/security --coverage
```

## Integration Points

- **authStore.ts**: Uses `secureStorage` for token persistence
- **apiClient.ts**: Uses `secureStorage` for access token retrieval
- **authInterceptor.ts**: Uses `secureStorage` for token operations
- **refreshToken.ts**: Uses `secureStorage` for refresh token management
- **uploadService.ts**: Uses `secureStorage` for auth token
- **environment.ts**: Uses `HttpsEnforcer` to validate API URL

## Production Checklist

- [ ] HTTPS enforced for all API URLs
- [ ] Tokens stored in SecureStore (not MMKV)
- [ ] Session timeout and inactivity logout active
- [ ] Deep links validated through backend
- [ ] Input validation on all user inputs
- [ ] Sensitive data redacted in logs
- [ ] Device security checks enabled
- [ ] Role-based access control enforced
- [ ] File upload validation active
- [ ] No secrets bundled in mobile app
