# Subscription Module Documentation

## Overview

The `features/subscription/` module provides a complete Enterprise SaaS Subscription & Add-on Management interface for the RentSecure React Native app. It integrates with the RentSecureBE Django backend to display plans, manage subscriptions, track usage, and handle add-ons.

## Backend Compatibility

**Critical:** This module is built against the **verified RentSecureBE backend contract**. See `SUBSCRIPTION_BACKEND_COMPATIBILITY_REPORT.md` for the full analysis.

### Backend Plans (Use These Exact Names)
- `free` — Free plan (default)
- `pro` — Pro plan
- `elite` — Elite plan

### Backend URLs Used
```
GET    /api/subscription-plans/              — List active plans
GET    /api/subscription-plans/{id}/         — Plan detail
GET    /api/user-subscriptions/              — Current user's subscription
POST   /api/user-subscriptions/              — Create/upsert subscription
GET    /api/addon-purchases/                 — List add-ons
POST   /api/addon-purchases/                 — Purchase add-on
GET    /api/usage-limits/                    — Usage limits
GET    /auth/bootstrap/                      — Bootstrap data
```

### Missing Backend APIs
The following backend APIs do **not** exist yet:
- Subscription payment order creation
- Subscription payment verification
- Subscription webhook handler
- Upgrade/downgrade actions
- Cancellation with graceful expiry
- Renewal API
- Subscription invoices
- Subscription payment history

The frontend handles these gracefully by showing "Coming Soon" states.

## Folder Structure

```
features/subscription/
├── components/
│   ├── index.ts
│   ├── AddOnCard.tsx
│   ├── CurrentPlanCard.tsx
│   ├── EmptyState.tsx
│   ├── FeatureLimitRow.tsx
│   ├── PlanCard.tsx
│   ├── PlanComparisonTable.tsx
│   ├── PaymentStatusBadge.tsx
│   ├── SubscriptionGuardWrapper.tsx
│   └── UsageProgressBar.tsx
├── constants/
│   ├── index.ts
│   └── features.ts
├── hooks/
│   ├── index.ts
│   ├── useAddOns.ts
│   ├── useCurrentSubscription.ts
│   ├── useEffectiveLimits.ts
│   ├── useSubscription.ts
│   ├── useSubscriptionActions.ts
│   ├── useSubscriptionPlans.ts
│   └── useUsageLimits.ts
├── repository/
│   ├── index.ts
│   └── subscriptionRepository.ts
├── screens/
│   ├── index.ts
│   ├── AddOnDetailsScreen.tsx
│   ├── AddOnsScreen.tsx
│   ├── CancellationScreen.tsx
│   ├── CurrentPlanScreen.tsx
│   ├── DowngradePlanScreen.tsx
│   ├── InvoicesScreen.tsx
│   ├── ManageSubscriptionScreen.tsx
│   ├── PaymentHistoryScreen.tsx
│   ├── PaymentStatusScreen.tsx
│   ├── PlanComparisonScreen.tsx
│   ├── PlanDetailsScreen.tsx
│   ├── PurchaseConfirmationScreen.tsx
│   ├── RenewSubscriptionScreen.tsx
│   ├── SubscriptionDashboardScreen.tsx
│   ├── SubscriptionExpiryScreen.tsx
│   ├── SubscriptionUsageScreen.tsx
│   └── UpgradePlanScreen.tsx
├── services/
│   ├── index.ts
│   ├── limitService.ts
│   ├── paymentService.ts
│   └── subscriptionService.ts
├── store/
│   ├── index.ts
│   └── subscriptionStore.ts
├── tests/
│   ├── index.ts
│   ├── limitService.test.ts
│   ├── store.test.ts
│   ├── subscriptionHelpers.test.ts
│   ├── subscriptionService.test.ts
│   └── validations.test.ts
├── types/
│   ├── index.ts
│   ├── limits.ts
│   ├── payment.ts
│   └── subscription.ts
└── utils/
    ├── formatting.ts
    ├── index.ts
    ├── limitHelpers.ts
    └── subscriptionHelpers.ts
```

## Architecture

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   BootstrapView │────▶│  useSubscription │────▶│ subscriptionStore│
│   (backend)     │     │   (React Query)  │     │   (Zustand)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   UI Screens    │
                                              │  (Expo Router)  │
                                              └─────────────────┘
```

### Layers

1. **Repository** (`repository/subscriptionRepository.ts`) — API client layer, calls `apiService`
2. **Services** (`services/`) — Business logic: subscription state, limit computation, payment
3. **Hooks** (`hooks/`) — React Query hooks for server state, invalidation on mutations
4. **Store** (`store/subscriptionStore.ts`) — Zustand store for client-side subscription state
5. **Components** (`components/`) — Reusable UI components
6. **Screens** (`screens/`) — Full screen components
7. **Types** (`types/`) — TypeScript interfaces matching backend response shapes
8. **Utils** (`utils/`) — Helper functions for formatting, expiry checks, limit computation

### State Management

- **React Query** for all server state (subscription, plans, add-ons, usage limits)
- **Zustand** for client-side subscription state (`useSubscriptionFeatureStore`)
- Queries are invalidated after mutations (purchase, cancel, upgrade)

### Feature Limit Computation

Effective limits are computed client-side using:

```
effectiveLimit = planLimit + addOnLimit
```

Where:
- `planLimit` comes from `PlanFeatureLimit` (backend)
- `addOnLimit` is the sum of `AddOnPurchase.amount` for the feature

**Important:** The backend does not expose plan limits through the usage-limits endpoint. The frontend must fetch plans separately and compute effective limits.

## Key Patterns

### Subscription Expiry Handling

```typescript
const { isExpired, daysRemaining, isInGracePeriod } = useSubscriptionStatus();

if (isExpired) {
  // Show expired state with renewal option
}
```

### Feature Limit Checking

```typescript
const { data: effectiveLimits } = useEffectiveLimits();

effectiveLimits?.forEach(limit => {
  if (!limit.canUse) {
    // Show upgrade/add-on prompt
  }
});
```

### React Query Invalidation

After any mutation:
```typescript
queryClient.invalidateQueries({ queryKey: ['subscription'] });
```

### Navigation Guards

- `SubscriptionGuard` — Wraps entire tabs navigator, redirects expired users
- `FeatureLimitGuard` — Per-feature guard, blocks specific actions when limit reached
- `PermissionGuard` — Checks `subscription:read` and `subscription:write` permissions

## Backend API Contract

### SubscriptionPlan
```typescript
interface SubscriptionPlan {
  id: number;
  name: 'free' | 'pro' | 'elite';
  monthly_price: string;
  yearly_price: string;
  features: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### UserSubscription
```typescript
interface UserSubscription {
  id: number;
  user: number;
  plan: SubscriptionPlan | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  is_yearly: boolean;
  tax_reminder_days_before: number;
  rent_reminder_days_before: number;
  created_at: string;
  updated_at: string;
}
```

### AddOnPurchase
```typescript
interface AddOnPurchase {
  id: number;
  user: number;
  name: string;  // Feature key
  amount: string;
  is_recurring: boolean;
  purchase_date: string;
}
```

### UsageLimit
```typescript
interface UsageLimit {
  id: number;
  user: number;
  feature_key: string;
  usage_count: number;
  updated_at: string;
}
```

## Security Considerations

1. **No Razorpay secrets in mobile app** — All payment operations go through backend
2. **No client-side payment verification** — Backend verifies all payments
3. **No offline activation** — Subscription state always refreshed from backend
4. **No offline purchases** — Add-ons and upgrades require network
5. **No feature-limit bypass** — Limits are checked server-side via `FeatureEnforcer`
6. **Grace period** — 7-day grace period after expiry before falling back to free plan

## Testing

Run tests:
```bash
cd /Users/sbairagi/Desktop/MVP\ Project/rentsecure-app
npx jest src/features/subscription/tests/
```

Test coverage:
- `subscriptionService.test.ts` — Subscription expiry, days remaining, upgrade/downgrade logic
- `limitService.test.ts` — Plan limits, add-on limits, effective limit computation
- `subscriptionHelpers.test.ts` — Date formatting, currency formatting, expiry checks
- `validations.test.ts` — Plan transitions, date validation
- `store.test.ts` — Zustand store state management

## Missing Backend Functionality

The following backend changes are **required** for full payment functionality:

1. **Subscription Payment Order API** — Create Razorpay order for subscription/upgrade
2. **Subscription Payment Verification API** — Verify payment and activate subscription
3. **Subscription Webhook Handler** — Handle async payment confirmation
4. **Upgrade/Downgrade Actions** — `PATCH /api/user-subscriptions/{id}/upgrade/`
5. **Cancel Action** — `POST /api/user-subscriptions/{id}/cancel/`
6. **Renew Action** — `POST /api/user-subscriptions/{id}/renew/`
7. **Subscription Invoices** — Generate PDF invoices for subscription payments
8. **PlanFeatureLimit Endpoint** — Uncomment in `core/urls.py`

See `SUBSCRIPTION_BACKEND_COMPATIBILITY_REPORT.md` for detailed backend requirements.

## Integration Points

### Bootstrap
Subscription data is loaded during app bootstrap via `/auth/bootstrap/`. The bootstrap service populates both the Zustand store and React Query cache.

### Navigation Guards
- `SubscriptionGuard` wraps the entire tabs navigator
- `FeatureLimitGuard` is used per-feature throughout the app
- Both check the backend via `checkSubscriptionAccess()` and `checkFeatureAccess()`

### Notifications
Subscription events (payment success, expiry, upgrade) should be handled by the existing notification hub at `features/notifications/`.

### Existing Stores
- `useSubscriptionStore` (global) — Legacy subscription store, being phased out
- `useSubscriptionFeatureStore` (feature-scoped) — New subscription store

## Known Limitations

1. **No subscription payment UI** — Backend lacks payment APIs
2. **No invoice generation** — Backend lacks subscription invoice API
3. **No payment history** — Backend lacks payment history API
4. **Plan features are text** — Backend stores features as comma-separated text, not structured data
5. **No proration logic** — Upgrade/downgrade mid-cycle not implemented
6. **No renewal reminders** — No automated expiry notifications

## Future Enhancements

1. Add Razorpay subscription integration (requires backend changes)
2. Implement proration for plan changes
3. Add subscription analytics (usage trends, cost projections)
4. Add trial period support
5. Add team/organization subscription management
6. Add subscription export (CSV/PDF reports)
