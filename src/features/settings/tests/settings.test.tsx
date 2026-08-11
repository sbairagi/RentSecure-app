import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as PaperProvider } from 'react-native-paper';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        {children}
      </PaperProvider>
    </QueryClientProvider>
  );
};

describe('Settings Types', () => {
  it('has correct ProfileData shape', () => {
    const profile = {
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      phone: '+919876543210',
      role: 'property_owner',
      permissions: [],
      is_phone_verified: true,
    };
    expect(profile.id).toBe('1');
    expect(profile.email).toBe('test@example.com');
    expect(profile.role).toBe('property_owner');
    expect(profile.is_phone_verified).toBe(true);
  });

  it('ProfileData includes permissions array', () => {
    const profile = {
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      phone: '+919876543210',
      role: 'property_owner',
      permissions: ['property:read', 'settings:read'],
      is_phone_verified: true,
    };
    expect(profile.permissions).toContain('property:read');
    expect(profile.permissions).toContain('settings:read');
  });

  it('has correct NotificationPreference shape', () => {
    const prefs = {
      push_enabled: true,
      rent_alerts_push: true,
      rent_alerts_whatsapp: true,
      rent_alerts_email: true,
      monthly_summary_email: true,
      monthly_summary_whatsapp: false,
      payout_alerts_whatsapp: true,
      payout_alerts_email: false,
      maintenance_push: true,
      visitor_push: true,
      agreement_push: true,
      subscription_push: true,
      system_push: true,
      receive_rent_alerts: true,
      receive_tax_alerts: true,
      receive_vacancy_alerts: true,
      receive_flagged_alerts: true,
      receive_voice_alerts: true,
      language_preference: 'en',
      alert_frequency: 'weekly',
      greeting_prefix: '',
      reminder_time: '09:00:00',
      rent_reminders_enabled: true,
    };
    expect(prefs.push_enabled).toBe(true);
    expect(prefs.rent_alerts_push).toBe(true);
    expect(prefs.maintenance_push).toBe(true);
    expect(prefs.language_preference).toBe('en');
    expect(prefs.rent_reminders_enabled).toBe(true);
  });

  it('has correct ThemeMode values', () => {
    const modes = ['light', 'dark', 'system'] as const;
    expect(modes).toHaveLength(3);
    expect(modes).toContain('light');
    expect(modes).toContain('dark');
    expect(modes).toContain('system');
  });

  it('has correct DeleteAccountState shape', () => {
    const state = {
      step: 'idle' as const,
    };
    expect(state.step).toBe('idle');
  });

  it('has correct SubscriptionPlan shape', () => {
    const plan = {
      id: 1,
      name: 'pro',
      monthly_price: '499.00',
      yearly_price: '4999.00',
      features: 'Unlimited buildings',
      is_active: true,
    };
    expect(plan.name).toBe('pro');
    expect(plan.monthly_price).toBe('499.00');
  });

  it('has correct DeviceInfo shape', () => {
    const device = {
      deviceId: 'abc123',
      deviceModel: 'iPhone 15',
      deviceName: 'My iPhone',
      platform: 'ios' as const,
      osVersion: '17.0',
      appVersion: '1.0.0',
      buildVersion: '1',
    };
    expect(device.platform).toBe('ios');
    expect(device.deviceId).toBe('abc123');
  });

  it('has correct DeviceTokenData shape', () => {
    const device = {
      id: 1,
      token: 'token123',
      device_id: 'dev456',
      platform: 'android',
      fcm_token: 'fcm789',
      active: true,
    };
    expect(device.id).toBe(1);
    expect(device.platform).toBe('android');
    expect(device.active).toBe(true);
  });

  it('DeviceTokenData defaults inactive to false', () => {
    const device = {
      id: 2,
      token: 'token',
      device_id: 'dev',
      platform: 'ios',
      fcm_token: 'fcm',
      active: false,
    };
    expect(device.active).toBe(false);
  });
});

describe('Settings API', () => {
  it('settingsApi exports required methods', async () => {
    const { settingsApi } = await import('../api/settingsApi');
    expect(typeof settingsApi.getProfile).toBe('function');
    expect(typeof settingsApi.updateProfile).toBe('function');
    expect(typeof settingsApi.changePassword).toBe('function');
    expect(typeof settingsApi.logout).toBe('function');
    expect(typeof settingsApi.logoutAllDevices).toBe('function');
    expect(typeof settingsApi.deactivateAccount).toBe('function');
    expect(typeof settingsApi.deleteAccount).toBe('function');
    expect(typeof settingsApi.getNotificationPreference).toBe('function');
    expect(typeof settingsApi.updateNotificationPreference).toBe('function');
    expect(typeof settingsApi.listDevices).toBe('function');
    expect(typeof settingsApi.registerDevice).toBe('function');
  });
});
