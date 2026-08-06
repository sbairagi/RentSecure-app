// @ts-nocheck
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import React from 'react';
import { useRenters } from '../../hooks/useRenters';
import { useRentersStore } from '../../store/rentersStore';
import { mockRenterListResponse } from '../../tests/mocks/data';

jest.mock('../../services/rentersApi');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRenters', () => {
  beforeEach(() => {
    queryClient.clear();
    useRentersStore.setState({
      renters: [],
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  it('should return renters from store', async () => {
    useRentersStore.setState({ renters: mockRenterListResponse.results });
    const { result } = renderHook(() => useRenters(), { wrapper });
    expect(result.current.renters).toHaveLength(1);
  });

  it('should return loading state', async () => {
    const { result } = renderHook(() => useRenters(), { wrapper });
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should handle error state', async () => {
    useRentersStore.setState({ error: 'Failed to load', isLoading: false });
    const { result } = renderHook(() => useRenters(), { wrapper });
    expect(result.current.error).toBe('Failed to load');
  });

  it('should provide refresh function', async () => {
    const { result } = renderHook(() => useRenters(), { wrapper });
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should return total count', async () => {
    useRentersStore.setState({ renters: mockRenterListResponse.results });
    const { result } = renderHook(() => useRenters(), { wrapper });
    expect(result.current.total).toBe(1);
  });
});
