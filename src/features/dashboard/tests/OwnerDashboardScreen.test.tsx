import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import OwnerDashboardScreen from '../OwnerDashboardScreen';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockDashboardData = {
  stats: {
    total_buildings: 5,
    total_units: 20,
    occupied_units: 15,
    vacant_units: 5,
    active_renters: 15,
    caretakers: 2,
    monthly_collection: 150000,
    pending_collection: 10000,
    occupancy_rate: 75.0,
  },
  analytics: {
    monthly_rent_collection: [],
    occupancy_rate: 75.0,
    occupancy_trend: [],
    revenue_trend: [],
    collection_trend: [],
  },
  recent: {
    rent_payments: [],
    tenants: [],
    agreements: [],
    notifications: [],
  },
  pending_tasks: {
    rent_due_today: 0,
    agreements_expiring: 0,
    pending_verification: 0,
    maintenance_requests: [],
    pending_payouts: [],
  },
  notifications: {
    preview: [],
    unread_count: 0,
  },
  subscription: {
    id: 1,
    name: 'pro',
    monthly_price: '29.99',
    yearly_price: '299.99',
    features: 'Full feature access',
    is_active: true,
    start_date: '2024-01-01',
    end_date: '2025-01-01',
    is_active_subscription: true,
    is_yearly: false,
    is_subscription_expired: false,
  },
  plan_limits: [
    { feature_key: 'max_buildings', value: '10' },
    { feature_key: 'max_units', value: '50' },
  ],
  feature_usage: [],
  payouts: { success: 0, pending: 0, failed: 0 },
};

jest.mock('@/features/dashboard/hooks', () => ({
  useDashboard: () => ({
    data: mockDashboardData,
    isLoading: false,
    error: null,
    pullToRefresh: jest.fn(),
  }),
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: { fullName: 'Test Owner', firstName: 'Test' },
  }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({ isConnected: true }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('react-native-flash-message', () => ({
  showMessage: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        {children}
      </PaperProvider>
    </QueryClientProvider>
  );
};

describe('OwnerDashboardScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<OwnerDashboardScreen />, { wrapper });
    expect(toJSON()).toBeTruthy();
  });

  it('displays owner greeting', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText(/Good/i)).toBeTruthy();
    });
  });

  it('displays stats when data is loaded', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('5')).toBeTruthy();
    });
  });

  it('displays subscription widget with plan limits', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('pro')).toBeTruthy();
    });
  });
});
