export interface DeviceToken {
  id: number;
  token: string;
  device_id: string;
  platform: 'ios' | 'android' | 'web';
  fcm_token: string;
  active: boolean;
  last_used: string;
  created_at: string;
}
