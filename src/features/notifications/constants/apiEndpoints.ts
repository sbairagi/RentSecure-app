
export const NOTIFICATION_ENDPOINTS = {
  LIST: '/api/notifications/get/',
  MARK_READ: (id: number) => `/api/notifications/mark/${id}/`,
  MARK_ALL_READ: '/api/notifications/mark-all-read/', // MISSING - will be added if backend supports
  DELETE: (id: number) => `/api/notifications/${id}/`, // MISSING
  UNREAD_COUNT: '/api/notifications/unread/', // MISSING
  SAVE_TOKEN: '/api/notifications/save-token/',
  REGISTER_FCM: '/api/notifications/register-fcm/',
  PREFERENCES: '/api/owner/update-alert-preferences/', // EXISTS in core
  PREFERENCES_GET: '/api/owner/alert-preferences/', // MISSING
  WHATSAPP_LOGS: '/api/notifications/whatsapp-logs/', // MISSING
  REMINDERS: '/api/notifications/reminders/', // MISSING
  HISTORY: '/api/notifications/history/', // MISSING
  BROADCASTS: '/api/notifications/broadcasts/', // MISSING
} as const;
