export const SUBSCRIPTION_CONSTANTS = {
  API: {
    PLANS: '/api/subscription-plans/',
    PLAN_DETAIL: (id: number | string) => `/api/subscription-plans/${id}/`,
    CURRENT: '/api/user-subscriptions/',
    CURRENT_DETAIL: (id: number | string) => `/api/user-subscriptions/${id}/`,
    ADD_ONS: '/api/addon-purchases/',
    ADD_ON_DETAIL: (id: number | string) => `/api/addon-purchases/${id}/`,
    USAGE_LIMITS: '/api/usage-limits/',
    BOOTSTRAP: '/auth/bootstrap/',
    CREATE_ORDER: '/api/subscription-orders/create/',
    VERIFY_PAYMENT: '/api/subscription-payments/verify/',
    PAYMENT_HISTORY: '/api/subscription-payments/',
    UPGRADE: (id: number | string) => `/api/user-subscriptions/${id}/upgrade/`,
    DOWNGRADE: (id: number | string) => `/api/user-subscriptions/${id}/downgrade/`,
    CANCEL: (id: number | string) => `/api/user-subscriptions/${id}/cancel/`,
    RENEW: (id: number | string) => `/api/user-subscriptions/${id}/renew/`,
  } as const,
  GRACE_PERIOD_DAYS: 7,
  CACHE: {
    PLANS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
    SUBSCRIPTION_STALE_TIME: 5 * 60 * 1000, // 5 minutes
    ADD_ONS_STALE_TIME: 5 * 60 * 1000,
    USAGE_LIMITS_STALE_TIME: 5 * 60 * 1000,
  },
  PLAN_ORDER: ['free', 'pro', 'elite'] as const,
} as const;
