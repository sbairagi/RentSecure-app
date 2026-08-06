// @ts-nocheck
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useRenter } from '../../hooks/useRenter';
import { useRentersStore } from '../../store/rentersStore';
import { mockRenter } from '../../tests/mocks/data';

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

describe('useRenter', () => {
  beforeEach(() => {
    queryClient.clear();
    useRentersStore.setState({
      selectedRenter: null,
      isLoading: false,
      error: null,
    });
  });

  it('should not fetch when id is falsy', () => {
    const { result } = renderHook(() => useRenter(0), { wrapper });
    expect(result.current.renter).toBeNull();
  });

  it('should return renter when loaded', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.renter).toEqual(mockRenter);
  });

  it('should handle loading state', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should provide deleteRenter function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.deleteRenter).toBe('function');
  });

  it('should provide vacate function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.vacate).toBe('function');
  });

  it('should provide updateStatus function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.updateStatus).toBe('function');
  });

  it('should provide assignUnit function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.assignUnit).toBe('function');
  });

  it('should provide transferUnit function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.transferUnit).toBe('function');
  });

  it('should provide rate function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.rate).toBe('function');
  });

  it('should provide refresh function', async () => {
    const { result } = renderHook(() => useRenter(1), { wrapper });
    expect(typeof result.current.refresh).toBe('function');
  });
});
