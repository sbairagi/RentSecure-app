# RentSecure Navigation Architecture Documentation

## Table of Contents

1. [Navigation Architecture Overview](#navigation-architecture-overview)
2. [Route Registry](#route-registry)
3. [Deep-Link Architecture](#deep-link-architecture)
4. [Notification Routing](#notification-routing)
5. [Authentication Redirect Flow](#authentication-redirect-flow)
6. [Role-Based Routing](#role-based-routing)
7. [Permission Handling](#permission-handling)
8. [Payment Link Flow](#payment-link-flow)
9. [QR Flow](#qr-flow)
10. [Search Integration](#search-integration)
11. [AI Integration](#ai-integration)
12. [Error Handling](#error-handling)
13. [Testing Strategy](#testing-strategy)
14. [Backend Compatibility Report](#backend-compatibility-report)

---

## Navigation Architecture Overview

### Project Structure

```
src/navigation/
├── routes/
│   ├── index.ts                    # Route registry exports
│   ├── routeRegistry.ts            # Central route definitions (90+ routes)
│   └── roleRoutes.ts               # Role-based route access
├── guards/
│   ├── index.ts                    # Guard exports
│   ├── RouteGuard.tsx               # Primary authentication/authorization guard
│   ├── AuthGuard.tsx                # Simplified auth guard
│   ├── PermissionGuard.tsx          # Permission-based guard
│   └── SubscriptionGuard.tsx        # Subscription status guard
├── deep-links/
│   ├── index.ts                    # Deep link exports
│   ├── deepLinkConfig.ts            # Deep link configuration
│   ├── deepLinkParser.ts            # URL parser and validator
│   ├── deepLinkValidator.ts         # Payload validation
│   └── deepLinkNavigator.ts         # Navigation handler
├── notification-routing/
│   ├── index.ts                    # Notification routing exports
│   ├── notificationRouter.ts        # Notification → route mapping
│   ├── notificationHandler.ts       # Push notification tap handler
│   ├── notificationPayload.ts       # Payload parser
│   └── notificationTypes.ts         # Notification types
├── linking/
│   ├── index.ts                    # Linking exports
│   └── expoLinkingConfig.ts         # Expo Router linking config
├── navigation-state/
│   ├── index.ts                    # State exports
│   └── navigationStateManager.ts    # Central state manager
├── types/
│   ├── index.ts                    # Type exports
│   ├── navigation.types.ts          # Core navigation types
│   ├── routeTypes.ts                # Route types
│   ├── guardTypes.ts                # Guard types
│   ├── deepLinkTypes.ts             # Deep link types
│   └── notificationTypes.ts         # Notification types
├── constants/
│   ├── index.ts                    # Constant exports
│   ├── routes.ts                    # Route constants
│   ├── deepLinks.ts                 # Deep link constants
│   ├── notifications.ts             # Notification constants
│   └── guards.ts                    # Guard constants
├── utils/
│   ├── index.ts                    # Utility exports
│   ├── roleRedirect.ts              # Role redirect logic
│   ├── permissions.ts               # Permission checks
│   ├── subscription.ts              # Subscription utilities
│   ├── routeUtils.ts                # Route utility functions
│   └── securityUtils.ts             # Security validation
├── hooks/
│   └── useNavigationAnalytics.ts    # Navigation analytics
├── components/
│   ├── RouteGuard.tsx               # (legacy, re-exported)
│   ├── AuthGuard.tsx                # (legacy, re-exported)
│   ├── PermissionGuard.tsx          # (legacy, re-exported)
│   ├── SubscriptionGuard.tsx        # (legacy, re-exported)
│   ├── VersionGuard.tsx             # Version check guard
│   ├── FeatureLimitGuard.tsx        # Feature limit guard
│   └── MaintenanceGuard.tsx         # Maintenance mode guard
├── tests/
│   ├── routeRegistry.test.ts        # Route registry tests
│   ├── deepLinkParser.test.ts       # Deep link tests
│   ├── notificationRouting.test.ts  # Notification routing tests
│   ├── authRedirect.test.ts         # Auth redirect tests
│   ├── routeAccess.test.ts          # Route access tests
│   └── securityUtils.test.ts        # Security utility tests
└── index.ts                        # Main navigation exports
```

### Navigation Flow

```
AppLayout (_layout.tsx)
├── Bootstrap (useBootstrap)
│   ├── SplashScreen (while loading)
│   ├── OfflineScreen (backend down)
│   ├── MaintenanceScreen (maintenance mode)
│   ├── ForceUpdateScreen (version unsupported)
│   └── SessionExpiredScreen (token expired)
└── RouteGuard requireAuth={false}
    └── Stack
        ├── splash → SplashScreen
        ├── (auth) → AuthLayout
        │   ├── welcome
        │   ├── login
        │   ├── register
        │   └── ...
        ├── (drawer) → DrawerLayout
        │   └── (tabs) → DrawerTabsLayout
        │       ├── RouteGuard requireAuth
        │       ├── VersionGuard
        │       ├── SubscriptionGuard
        │       └── Tabs
        │           ├── dashboard
        │           ├── properties
        │           ├── payments
        │           ├── notifications
        │           ├── search
        │           ├── profile
        │           ├── subscription
        │           ├── settings
        │           ├── support
        │           ├── reports
        │           ├── ai-assistant
        │           ├── agreements
        │           ├── buildings
        │           ├── units
        │           ├── renters
        │           ├── caretakers
        │           ├── visitors
        │           └── maintenance
        └── not-found
```

---

## Route Registry

### Overview

The route registry is a centralized configuration of all application routes. It provides:

- Single source of truth for route definitions
- Role-based access control metadata
- Permission requirements per route
- Subscription requirements per route
- Deep link pattern mappings

### Route Definition Structure

```typescript
interface RouteDefinition {
  name: string;              // Unique route identifier
  path: string;              // Expo Router file path
  group: RouteGroup;         // 'auth' | 'drawer' | 'public'
  requiredRoles?: UserRole[]; // Required user roles
  requiredPermissions?: Permission[]; // Required permissions
  requiresSubscription?: boolean; // Requires active subscription
  featureKey?: string;       // Associated feature key
  deepLinkPattern?: string;  // Deep link pattern
  isPublic?: boolean;        // Publicly accessible
  children?: RouteDefinition[]; // Child routes
}
```

### Route Groups

| Group | Description | Access |
|-------|-------------|--------|
| `auth` | Authentication screens | Public (unauthenticated users) |
| `drawer` | Main application screens | Protected (authenticated users) |
| `public` | Public screens | Public |

### Route Count

- **Total Routes**: 90+
- **Auth Routes**: 11
- **Protected Routes**: 79+
- **Public Routes**: 2 (splash, not-found)

### Key Routes

| Route Name | Path | Required Role | Required Permission |
|------------|------|---------------|---------------------|
| dashboard | `/(drawer)/(tabs)/dashboard` | Any authenticated | `dashboard:read` |
| buildings | `/(drawer)/(tabs)/buildings` | property_owner, admin, super_admin | `building:read` |
| units | `/(drawer)/(tabs)/units` | property_owner, admin, super_admin | `unit:read` |
| renters | `/(drawer)/(tabs)/renters` | property_owner, admin, super_admin | `renter:read` |
| caretakers | `/(drawer)/(tabs)/caretakers` | property_owner, admin, super_admin | `caretaker:read` |
| payments | `/(drawer)/(tabs)/payments` | property_owner, renter, admin, super_admin | `payment:read` |
| agreements | `/(drawer)/(tabs)/agreements` | property_owner, renter, caretaker, admin, super_admin | `agreement:read` |
| maintenance | `/(drawer)/(tabs)/maintenance` | property_owner, caretaker, renter, admin, super_admin | `maintenance:read` |
| visitors | `/(drawer)/(tabs)/visitors` | property_owner, caretaker, renter, admin, super_admin | `dashboard:read` |
| subscription | `/(drawer)/(tabs)/subscription` | property_owner, ca_partner, admin, super_admin | `subscription:read` |

---

## Deep-Link Architecture

### URL Scheme

- **Custom Scheme**: `rentsecure://`
- **Universal Links**: `https://app.rentsecureapp.com/`
- **Host**: `app.rentsecureapp.com`

### Supported Deep Links

| Pattern | Route | Description |
|---------|-------|-------------|
| `rentsecure://building/{id}` | `/(drawer)/(tabs)/buildings/[id]` | Building detail |
| `rentsecure://unit/{id}` | `/(drawer)/(tabs)/units/[id]` | Unit detail |
| `rentsecure://renter/{id}` | `/(drawer)/(tabs)/renters/[id]` | Renter detail |
| `rentsecure://caretaker/{id}` | `/(drawer)/(tabs)/caretakers/[id]` | Caretaker detail |
| `rentsecure://rent/{id}` | `/(drawer)/(tabs)/payments/rent-record/[id]` | Rent record detail |
| `rentsecure://maintenance/{id}` | `/(drawer)/(tabs)/maintenance/[id]` | Maintenance detail |
| `rentsecure://visitor/{id}` | `/(drawer)/(tabs)/visitors/[id]` | Visitor detail |
| `rentsecure://agreement/{id}` | `/(drawer)/(tabs)/agreements/[id]` | Agreement detail |
| `rentsecure://subscription` | `/(drawer)/(tabs)/subscription` | Subscription page |
| `rentsecure://notification/{id}` | `/(drawer)/(tabs)/notifications/list` | Notifications list |

### Deep Link Security

1. **Authentication Required**: All resource deep links require authentication
2. **Role Validation**: User role is checked against allowed roles for the resource type
3. **ID Sanitization**: Resource IDs are sanitized to prevent injection attacks
4. **Token Sanitization**: Tokens are sanitized to remove suspicious characters
5. **Sensitive Data Exclusion**: No passwords, tokens, or sensitive data in URLs

### Deep Link Flow

```
User taps deep link
    ↓
Parse deep link URL
    ↓
Validate payload structure
    ↓
Check authentication
    ├── Not authenticated → Store pending route → Redirect to login
    └── Authenticated → Continue
        ↓
    Check role access
        ├── Denied → Redirect to dashboard
        └── Allowed → Navigate to target screen
            ↓
        Fetch resource from backend
            ↓
        Backend validates authorization
            ↓
        Display resource or show 403/404
```

---

## Notification Routing

### Notification Categories

| Category | Target Route | Resource Type |
|----------|-------------|---------------|
| `rent_due` | `/(drawer)/(tabs)/payments` | rent_record |
| `rent_paid` | `/(drawer)/(tabs)/payments` | rent_record |
| `rent_overdue` | `/(drawer)/(tabs)/payments` | rent_record |
| `maintenance_assigned` | `/(drawer)/(tabs)/maintenance` | maintenance |
| `maintenance_updated` | `/(drawer)/(tabs)/maintenance` | maintenance |
| `maintenance_completed` | `/(drawer)/(tabs)/maintenance` | maintenance |
| `visitor_request` | `/(drawer)/(tabs)/visitors` | visitor |
| `visitor_approved` | `/(drawer)/(tabs)/visitors` | visitor |
| `visitor_checked_in` | `/(drawer)/(tabs)/visitors` | visitor |
| `visitor_checked_out` | `/(drawer)/(tabs)/visitors` | visitor |
| `agreement_expiring` | `/(drawer)/(tabs)/agreements` | agreement |
| `agreement_signed` | `/(drawer)/(tabs)/agreements` | agreement |
| `agreement_created` | `/(drawer)/(tabs)/agreements` | agreement |
| `subscription_expiring` | `/(drawer)/(tabs)/subscription` | subscription |
| `subscription_renewed` | `/(drawer)/(tabs)/subscription` | subscription |
| `subscription_cancelled` | `/(drawer)/(tabs)/subscription` | subscription |
| `payment_success` | `/(drawer)/(tabs)/payments` | rent_record |
| `payment_failed` | `/(drawer)/(tabs)/payments` | rent_record |
| `payout_success` | `/(drawer)/(tabs)/payments` | rent_record |
| `payout_failed` | `/(drawer)/(tabs)/payments` | rent_record |
| `document_uploaded` | `/(drawer)/(tabs)/buildings` | document |
| `kyc_completed` | `/(drawer)/(tabs)/renters` | renter |
| `onboarding_invite` | `/(auth)/register` | renter |
| `system` | `/(drawer)/(tabs)/notifications/list` | - |
| `general` | `/(drawer)/(tabs)/notifications/list` | - |

### Notification Categorization

Notifications are categorized by matching title/message against regex patterns:

```typescript
const patterns: Record<string, RegExp[]> = {
  rent_due: [/rent.*due/i, /due.*rent/i],
  rent_paid: [/rent.*paid/i, /paid.*rent/i],
  maintenance_assigned: [/maintenance.*assigned/i],
  visitor_request: [/visitor.*request/i, /new visitor/i],
  agreement_expiring: [/agreement.*expir/i],
  subscription_expiring: [/subscription.*expir/i],
  // ... more patterns
};
```

### Cold Start Flow

```
App closed → Notification tapped → App launches
    ↓
Bootstrap initializes
    ↓
Store pending notification
    ↓
Authentication initializes
    ↓
Route to target screen
    ↓
Fetch resource from backend
```

### Warm Start Flow

```
App open → Notification tapped
    ↓
Check if navigation is ready
    ├── Not ready → Store pending notification → Wait
    └── Ready → Navigate directly
        ↓
    Avoid duplicate screens
        ↓
    Navigate to target screen
```

### Background State Flow

```
App in background → Notification tapped
    ↓
Check authentication state
    ├── Session valid → Navigate to target
    └── Session expired → Store pending → Redirect to login → Restore after auth
```

---

## Authentication Redirect Flow

### Flow Diagram

```
Deep link / Notification tapped
    ↓
Check authentication
    ├── Authenticated → Navigate to target
    └── Not authenticated
        ↓
    Store intended destination (pendingDeepLinkStore)
        ↓
    Navigate to login
        ↓
    User authenticates
        ↓
    Restore pending destination
        ↓
    Revalidate authorization
        ↓
    Navigate to target or show access denied
```

### Security Considerations

- Pending routes store only the route path, not sensitive data
- After authentication, backend revalidates all authorizations
- No resource data is preloaded based solely on deep link IDs

---

## Role-Based Routing

### Supported Roles

| Role | Level | Default Route | Tabs | Extra Routes |
|------|-------|---------------|-------|--------------|
| `super_admin` | 7 | dashboard | All | settings, support, ai-assistant |
| `admin` | 6 | dashboard | All | settings, support, ai-assistant |
| `property_owner` | 5 | dashboard | properties, visitors, payments, notifications, profile, search | settings, support, subscription, reports, agreements, ai-assistant |
| `renter` | 1 | dashboard | notifications, profile, search | settings |
| `caretaker` | 3 | dashboard | properties, visitors, notifications, profile, search | settings |
| `ca_partner` | 4 | dashboard | properties, notifications, profile | settings, reports, agreements |
| `support_executive` | 2 | dashboard | notifications, profile | settings, support |
| `user` | 0 | welcome | None | None |

### Feature Access by Role

| Feature | super_admin | admin | property_owner | renter | caretaker | ca_partner | support_executive |
|---------|-------------|-------|----------------|--------|-----------|------------|-------------------|
| buildings | ✓ | ✓ | ✓ | | ✓ | | |
| units | ✓ | ✓ | ✓ | | ✓ | | |
| renters | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| caretakers | ✓ | ✓ | ✓ | | | | |
| payments | ✓ | ✓ | ✓ | ✓ | | ✓ | ✓ |
| agreements | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| maintenance | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ |
| visitors | ✓ | ✓ | ✓ | | ✓ | | |
| reports | ✓ | ✓ | ✓ | | ✓ | ✓ | ✓ |
| subscription | ✓ | ✓ | ✓ | | | ✓ | |
| search | ✓ | ✓ | ✓ | ✓ | ✓ | | |
| ai-assistant | ✓ | ✓ | ✓ | | | | |
| support | ✓ | ✓ | ✓ | | | | ✓ |

---

## Permission Handling

### Permission Types

```typescript
type Permission =
  | 'dashboard:read'
  | 'property:read' | 'property:write'
  | 'building:read' | 'building:write'
  | 'unit:read' | 'unit:write'
  | 'renter:read' | 'renter:write'
  | 'caretaker:read' | 'caretaker:write'
  | 'payment:read' | 'payment:write'
  | 'report:read' | 'report:write'
  | 'settings:read' | 'settings:write'
  | 'user:read' | 'user:write'
  | 'subscription:read' | 'subscription:write'
  | 'agreement:read' | 'agreement:write'
  | 'notification:read' | 'notification:write'
  | 'maintenance:read' | 'maintenance:write'
  | 'ai:read';
```

### Permission Checks

```typescript
// Check single permission
hasPermission(role, 'building:read')

// Check any of multiple permissions
hasAnyPermission(role, ['building:read', 'building:write'])

// Check all permissions
hasAllPermissions(role, ['building:read', 'unit:read'])

// Check feature access
canAccessFeature(role, 'buildings')
```

---

## Payment Link Flow

### Backend Integration

1. Backend creates RentRecord with Razorpay
2. Payment link stored in `RentRecord.payment_link`
3. WhatsApp notification sent with payment link
4. User taps link → Opens app or browser
5. Deep link parsed → Navigate to payment screen
6. Backend verifies payment status via webhook
7. Payment status updated in app

### Deep Link Pattern

```
rentsecure://payment/{token}
```

### Security

- Payment result is always verified by backend
- No payment status is trusted from URL alone
- Backend webhook confirms final payment state

---

## QR Flow

### Visitor QR Integration

1. Owner creates visitor → Status: REQUESTED
2. Owner approves → Status: APPROVED
3. Owner generates QR → `qr_token` stored
4. QR displayed at gate
5. Gate kiosk POSTs to `/api/visitors/verify/` (no auth)
6. Backend validates QR (expiry, max uses, status)
7. App navigates to visitor detail if authorized

### Deep Link Pattern

```
rentsecure://visitor/{visitorId}
```

### Security

- QR data validated by RentSecureBE
- No direct navigation to privileged screens from QR alone
- Backend authorization determines access

---

## Search Integration

### Global Search

- Accessible via search tab (role-filtered)
- Every search result uses centralized navigation
- Search results navigate via `useDeepLinkNavigator`
- No hardcoded navigation in search result components

### Route Access

Search results can navigate to:
- Building detail
- Unit detail
- Renter detail
- Agreement detail
- Maintenance detail
- Visitor detail

---

## AI Integration

### AI Assistant Navigation

- AI returns backend-authorized resource references
- All AI-generated routes validated through centralized routing
- AI cannot trigger arbitrary navigation
- Route/resource type validated before navigation

### Security

- AI suggestions are validated against user permissions
- No direct URL navigation from AI output
- Backend authorization remains authoritative

---

## Error Handling

### Error Types

| Error | Handling |
|-------|----------|
| Invalid Link | Show error, redirect to dashboard |
| Unknown Route | Show 404 screen |
| Malformed Payload | Log warning, ignore |
| Missing Resource ID | Show error, redirect |
| 401 Unauthorized | Redirect to login |
| 403 Forbidden | Show access denied |
| 404 Not Found | Show not found screen |
| 409 Conflict | Show conflict error |
| 422 Validation Error | Show validation error |
| 429 Rate Limited | Show retry message |
| 500 Server Error | Show error screen |
| Offline | Show offline screen |
| Session Expired | Redirect to login |
| Subscription Expired | Redirect to subscription |
| Feature Restricted | Show upgrade prompt |
| Navigation Not Ready | Wait or store pending |

---

## Testing Strategy

### Test Coverage

| Test Suite | Coverage |
|------------|----------|
| `routeRegistry.test.ts` | Route definitions, uniqueness, access control |
| `deepLinkParser.test.ts` | URL parsing, validation, sanitization |
| `notificationRouting.test.ts` | Categorization, route mapping |
| `authRedirect.test.ts` | Pending routes, auth flow |
| `routeAccess.test.ts` | Permissions, role access, tab access |
| `securityUtils.test.ts` | Sanitization, sensitive parameter detection |

### Running Tests

```bash
npm test -- src/navigation/tests/
```

---

## Backend Compatibility Report

### Backend Status

| Feature | Backend Support | Frontend Implementation |
|---------|----------------|------------------------|
| Authentication | JWT (5 min access, 35 day refresh) | ✓ Implemented |
| User Roles | Django Groups (owner, renter, caretaker, ca, user) | ✓ Mapped |
| Permissions | Group permissions | ✓ Implemented |
| Notifications | Simple model (title, message, is_read) | ✓ Implemented (title-based categorization) |
| Subscription | UserSubscription model with is_active, end_date | ✓ Implemented |
| Feature Limits | UsageLimit + PlanFeatureLimit | ✓ Implemented |
| Payment Links | Razorpay payment_link field | ✓ Deep link support |
| Visitor QR | QR token with expiry | ✓ Deep link support |
| Onboarding | Renter onboarding_token | ✓ Deep link support |
| Push Notifications | Expo push + FCM | ✓ Handler implemented |

### Missing Backend Features

1. **Notification Payload Data**: Backend notifications don't include deep-link data (resource_type, resource_id). Frontend uses title/message pattern matching as fallback.

2. **Deep Link Endpoint**: No backend endpoint for deep link validation. Frontend validates locally and fetches resource after navigation.

3. **Payment Status in Deep Link**: Payment deep links only contain token. Final status verified via backend webhook.

### Backend Changes Required (Future)

1. **Add notification payload field**:
   ```python
   class Notification(models.Model):
       data = models.JSONField(default=dict, blank=True)  # Add this
   ```

2. **Include deep-link data in notification payload**:
   ```python
   notification.data = {
       'resource_type': 'rent_record',
       'resource_id': rent_record.id,
       'deep_link': f'rentsecure://rent/{rent_record.id}'
   }
   ```

---

## Quality Checklist

### Completed

- [x] One centralized route architecture
- [x] No scattered route strings
- [x] Expo Router compatible
- [x] Cold-start deep links work
- [x] Warm-start deep links work
- [x] Notification routing works
- [x] Authentication redirect works
- [x] Backend authorization remains authoritative
- [x] Payment result is verified by backend
- [x] QR result is verified by backend
- [x] AI cannot trigger arbitrary navigation
- [x] No sensitive data in URLs
- [x] No sensitive data in logs
- [x] Strict TypeScript
- [x] ESLint passes (new code)
- [x] React Query compatible
- [x] Accessibility maintained
- [x] Compatible with RentSecureBE
- [x] Production ready

### Notes

- Pre-existing `expo-router` type errors exist in the project (not introduced by this implementation)
- All new navigation code passes TypeScript compilation
- All new navigation code passes ESLint
- Unit tests cover core navigation logic
