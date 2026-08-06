// @ts-nocheck
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { useAgreementsStore } from '../../store/agreementsStore';
import { mockAgreementListResponse } from '../../tests/mocks/data';

jest.mock('../../services/agreementsApi');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestComponent = () => {
  const { agreements, isLoading, error } = useAgreementsStore();
  return (
    <View>
      <Text testID="loading">{isLoading ? 'loading' : 'idle'}</Text>
      <Text testID="error">{error || 'none'}</Text>
      <Text testID="count">{agreements.length}</Text>
    </View>
  );
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Agreement Management Integration', () => {
  beforeEach(() => {
    queryClient.clear();
    useAgreementsStore.setState({
      agreements: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  it('should display agreement count', async () => {
    useAgreementsStore.setState({ agreements: mockAgreementListResponse.results });
    render(<TestComponent />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('count').props.children).toBe(1);
    });
  });

  it('should handle loading state', async () => {
    useAgreementsStore.setState({ isLoading: true });
    render(<TestComponent />, { wrapper });

    expect(screen.getByTestId('loading').props.children).toBe('loading');
  });

  it('should handle error state', async () => {
    useAgreementsStore.setState({ error: 'Failed to load', isLoading: false });
    render(<TestComponent />, { wrapper });

    expect(screen.getByTestId('error').props.children).toBe('Failed to load');
  });

  it('should clear agreements', async () => {
    useAgreementsStore.setState({ agreements: mockAgreementListResponse.results });
    useAgreementsStore.getState().clearAgreements();
    expect(useAgreementsStore.getState().agreements).toHaveLength(0);
  });
});
