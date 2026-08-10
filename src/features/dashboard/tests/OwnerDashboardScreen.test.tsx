import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
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
    notice_period_renters: 2,
    revoked_renters: 1,
    deactivated_renters: 0,
    caretakers: 2,
    rent_expected: 200000,
    rent_collected: 150000,
    rent_pending: 30000,
    rent_overdue: 20000,
    overdue_renters_count: 3,
    late_fees_total: 5000,
    monthly_collection: 150000,
    pending_collection: 50000,
    collection_rate: 75.0,
    payment_status_breakdown: {
      paid: 15,
      pending: 3,
      overdue: 2,
      cancelled: 1,
    },
    occupancy_rate: 75.0,
    current_month: 'August 2026',
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
    rent_due_today: [],
    agreements_expiring: [],
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
  payouts: { success: 10, pending: 2, failed: 1 },
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

  it('displays current month', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('August 2026')).toBeTruthy();
    });
  });

  it('displays renter status stats', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('Notice Period')).toBeTruthy();
      expect(getByText('Revoked')).toBeTruthy();
      expect(getByText('Deactivated')).toBeTruthy();
    });
  });

  it('displays financial stats', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('Rent Expected')).toBeTruthy();
      expect(getByText('Rent Collected')).toBeTruthy();
      expect(getByText('Rent Pending')).toBeTruthy();
      expect(getByText('Rent Overdue')).toBeTruthy();
      expect(getByText('Late Fees')).toBeTruthy();
      expect(getByText('Collection Rate')).toBeTruthy();
    });
  });

  it('displays payment status summary', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('Payment Status')).toBeTruthy();
      expect(getByText('Paid')).toBeTruthy();
      expect(getByText('Pending')).toBeTruthy();
      expect(getByText('Overdue')).toBeTruthy();
      expect(getByText('Cancelled')).toBeTruthy();
    });
  });

  it('displays payout summary', async () => {
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('Payout Summary')).toBeTruthy();
      expect(getByText('Successful')).toBeTruthy();
      expect(getByText('Pending')).toBeTruthy();
      expect(getByText('Failed')).toBeTruthy();
    });
  });

  it('displays error state when error exists and no data', () => {
    jest.doMock('@/features/dashboard/hooks', () => ({
      useDashboard: () => ({
        data: null,
        isLoading: false,
        error: 'Network error',
        pullToRefresh: jest.fn(),
      }),
    }));
    const { getByText } = render(<OwnerDashboardScreen />, { wrapper });
    expect(getByText('Something went wrong')).toBeTruthy();
  });
});
