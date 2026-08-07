import type { NotificationChannel } from '@/features/notifications/types';

export const ENABLED_CHANNELS: NotificationChannel[] = ['in_app', 'whatsapp'];

export const PUSH_NOTIFICATION_CONFIG = {
  channelId: 'rentsecure-notifications',
  importance: 'high' as const,
  sound: 'default',
  vibrationPattern: [0, 250, 250, 250],
};
