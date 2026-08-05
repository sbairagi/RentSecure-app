# Bootstrap Engine

Enterprise Application Bootstrap Engine for RentSecure.

## Overview

The Bootstrap Engine is the very first logic executed when the application starts. It orchestrates the complete initialization flow from splash screen to main app navigation.

## Architecture

```
src/bootstrap/
├── types/                    # TypeScript type definitions
│   └── bootstrap.ts         # All bootstrap types
├── constants/               # Configuration constants
│   └── bootstrap.ts         # Timeouts, endpoints, error messages
├── services/                # Individual bootstrap services
│   ├── connectivityService.ts   # Network & backend availability
│   ├── versionService.ts        # App version checking
│   ├── maintenanceService.ts    # Maintenance mode checking
│   ├── sessionService.ts        # JWT validation & refresh
│   ├── permissionService.ts     # Permission loading
│   ├── subscriptionService.ts   # Subscription loading
│   ├── featureLimitService.ts   # Feature limits loading
│   ├── dashboardService.ts      # Dashboard summary loading
│   └── bootstrapService.ts      # Main orchestrator
├── stores/                  # Zustand global state
│   └── appStore.ts          # Application bootstrap state
├── hooks/                   # React hooks
│   └── useBootstrap.ts      # Main bootstrap hook + utilities
├── components/              # Reusable components
│   └── index.ts
├── screens/                 # Full screen components
│   ├── BootstrapSplashScreen.tsx   # Animated splash with progress
│   ├── OfflineScreen.tsx           # No internet / backend down
│   ├── MaintenanceScreen.tsx       # Server maintenance
│   ├── ForceUpdateScreen.tsx       # App update required
│   └── SessionExpiredScreen.tsx    # Session expired
└── index.ts                 # Barrel exports
```

## Bootstrap Flow

```
Splash Screen
    ↓
Initialize App
    ↓
Load Environment
    ↓
Initialize Logger
    ↓
Initialize Secure Storage
    ↓
Initialize Theme
    ↓
Initialize Language
    ↓
Initialize React Query
    ↓
Initialize Zustand
    ↓
Check Internet
    ↓
Check Backend Availability
    ↓
Check App Version
    ↓
Check Maintenance Mode
    ↓
Check Force Update
    ↓
Validate JWT
    ↓
Refresh JWT
    ↓
Load Current User
    ↓
Load User Permissions
    ↓
Load Subscription
    ↓
Load Feature Limits
    ↓
Load Add-ons
    ↓
Load Dashboard Summary
    ↓
Navigate User
```

## Bootstrap Phases

| Phase                    | Description                           | Skip if Offline |
| ------------------------ | ------------------------------------- | --------------- |
| `checking_connectivity`  | Check internet & backend availability | No              |
| `checking_maintenance`   | Check if app is in maintenance mode   | No              |
| `checking_version`       | Verify app version compatibility      | No              |
| `validating_session`     | Validate JWT token                    | Yes             |
| `refreshing_token`       | Refresh expired JWT token             | Yes             |
| `loading_user`           | Load current user profile             | Yes             |
| `loading_permissions`    | Load user permissions                 | Yes             |
| `loading_subscription`   | Load user subscription                | Yes             |
| `loading_feature_limits` | Load feature usage limits             | Yes             |
| `loading_addons`         | Load add-on purchases                 | Yes             |
| `loading_dashboard`      | Load dashboard summary                | Yes             |

## Services

### BootstrapService

Main orchestrator that runs all bootstrap steps in sequence.

```typescript
import { bootstrapService } from '@/bootstrap';

const result = await bootstrapService.initialize();
if (result.success) {
  // Bootstrap complete
}
```

### ConnectivityService

Checks internet connectivity and backend availability.

```typescript
import { connectivityService } from '@/bootstrap';

const isConnected = await connectivityService.isConnected();
const backendAvailable = await connectivityService.checkBackendAvailability(apiUrl);
```

### VersionService

Checks app version against backend requirements.

```typescript
import { versionService } from '@/bootstrap';

const versionInfo = await versionService.checkVersion();
const isSupported = versionService.isVersionSupported(currentVersion, minSupported);
```

### MaintenanceService

Checks if the app is in maintenance mode.

```typescript
import { maintenanceService } from '@/bootstrap';

const maintenanceInfo = await maintenanceService.checkMaintenance();
```

### SessionService

Validates and refreshes JWT tokens.

```typescript
import { sessionService } from '@/bootstrap';

const isValid = await sessionService.validateSession(accessToken);
const refreshed = await sessionService.refreshSession(refreshToken);
```

### PermissionService

Loads and manages user permissions.

```typescript
import { permissionService } from '@/bootstrap';

const permissions = await permissionService.loadPermissions();
const hasAccess = permissionService.hasPermission(permissions, 'dashboard:read');
```

### SubscriptionService

Loads and manages user subscription.

```typescript
import { subscriptionService } from '@/bootstrap';

const subscription = await subscriptionService.loadSubscription();
const isExpired = subscriptionService.isExpired(subscription);
```

### FeatureLimitService

Loads feature limits and add-ons.

```typescript
import { featureLimitService } from '@/bootstrap';

const limits = await featureLimitService.loadFeatureLimits();
const addOns = await featureLimitService.loadAddOns();
const canUse = featureLimitService.canUse(limits, 'max_buildings');
```

## Hooks

### useBootstrap

Main hook for bootstrap initialization.

```typescript
import { useBootstrap } from '@/bootstrap';

function MyComponent() {
  const {
    initialize,
    reload,
    reset,
    retry,
    isInitialized,
    currentPhase,
    error,
    errorMessage,
    isOnline,
    isMaintenance,
    isForceUpdate,
    retryCount,
  } = useBootstrap();

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, []);
}
```

### useBootstrapPhase

Check if a bootstrap phase has been reached.

```typescript
import { useBootstrapPhase } from '@/bootstrap';

function MyComponent() {
  const isSubscribed = useBootstrapPhase('loading_subscription');
  // Returns true when subscription loading phase is reached
}
```

### useBootstrapError

Access bootstrap error state.

```typescript
import { useBootstrapError } from '@/bootstrap';

function MyComponent() {
  const { error, errorMessage, hasError, isBackendDown, isMaintenance } = useBootstrapError();
}
```

### useConnectivity

Monitor network connectivity.

```typescript
import { useConnectivity } from '@/bootstrap';

function MyComponent() {
  const { status, isOnline, isOffline, checkBackend } = useConnectivity();
}
```

## Global State (appStore)

```typescript
interface AppStore {
  // Status
  isInitialized: boolean;
  isOnline: boolean;
  isMaintenance: boolean;
  isForceUpdate: boolean;

  // Version
  appVersion: string;
  backendVersion: string;

  // Maintenance
  maintenanceMessage: string;
  maintenanceScheduledAt?: string;

  // User Data
  permissions: string[];
  subscription: SubscriptionInfo | null;
  featureLimits: FeatureLimitInfo[];
  addons: AddOnInfo[];
  dashboardSummary: DashboardSummary | null;

  // Bootstrap State
  currentPhase: BootstrapPhase;
  error: BootstrapErrorType | null;
  errorMessage: string;
  retryCount: number;

  // Actions
  initialize: () => Promise<...>;
  reload: () => Promise<...>;
  reset: () => void;
}
```

## Error Handling

| Error Type             | Screen               | Action                          |
| ---------------------- | -------------------- | ------------------------------- |
| `backend_down`         | OfflineScreen        | Show retry button               |
| `internet_lost`        | OfflineScreen        | Show retry button               |
| `maintenance`          | MaintenanceScreen    | Show maintenance message        |
| `expired_token`        | SessionExpiredScreen | Redirect to login               |
| `version_unsupported`  | ForceUpdateScreen    | Redirect to app store           |
| `permission_missing`   | RouteGuard           | Redirect to appropriate screen  |
| `subscription_expired` | RouteGuard           | Redirect to subscription screen |
| `feature_blocked`      | FeatureLimitGuard    | Show upgrade prompt             |

## Integration

The Bootstrap Engine is integrated in `src/app/_layout.tsx`:

```typescript
import { BootstrapOrchestrator } from './BootstrapOrchestrator';

export default function AppLayout() {
  return (
    <BootstrapOrchestrator>
      <RouteGuard requireAuth={false}>
        {/* Main app content */}
      </RouteGuard>
    </BootstrapOrchestrator>
  );
}
```

## Backend API Endpoints

| Endpoint                        | Method | Description                    |
| ------------------------------- | ------ | ------------------------------ |
| `/api/auth/bootstrap/`          | GET    | Single-call bootstrap endpoint |
| `/api/auth/maintenance/`        | GET    | Maintenance mode status        |
| `/api/auth/app/version/`        | GET    | App version requirements       |
| `/api/auth/profile/`            | GET    | Current user profile           |
| `/api/token/refresh/`           | POST   | Refresh JWT token              |
| `/api/user-subscriptions/`      | GET    | User subscriptions             |
| `/api/addon-purchases/`         | GET    | User add-ons                   |
| `/api/usage-limits/`            | GET    | Feature usage limits           |
| `/api/owner/dashboard-summary/` | GET    | Dashboard summary (owners)     |
