// @ts-nocheck
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { useRentersStore } from '../../store/rentersStore';
import { mockRenterListResponse } from '../../tests/mocks/data';

jest.mock('../../services/rentersApi');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestComponent = () => {
  const { renters, isLoading, error } = useRentersStore();
  return (
    <View>
      <Text testID="loading">{isLoading ? 'loading' : 'idle'}</Text>
      <Text testID="error">{error || 'none'}</Text>
      <Text testID="count">{renters.length}</Text>
    </View>
  );
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Renter Management Integration', () => {
  beforeEach(() => {
    queryClient.clear();
    useRentersStore.setState({
      renters: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  it('should display renter count', async () => {
    useRentersStore.setState({ renters: mockRenterListResponse.results });
    render(<TestComponent />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('count').props.children).toBe(1);
    });
  });

  it('should handle loading state', async () => {
    useRentersStore.setState({ isLoading: true });
    render(<TestComponent />, { wrapper });

    expect(screen.getByTestId('loading').props.children).toBe('loading');
  });

  it('should handle error state', async () => {
    useRentersStore.setState({ error: 'Failed to load', isLoading: false });
    render(<TestComponent />, { wrapper });

    expect(screen.getByTestId('error').props.children).toBe('Failed to load');
  });

  it('should clear renters', async () => {
    useRentersStore.setState({ renters: mockRenterListResponse.results });
    useRentersStore.getState().clearRenters();
    expect(useRentersStore.getState().renters).toHaveLength(0);
  });
});
