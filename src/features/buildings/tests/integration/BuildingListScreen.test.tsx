import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BuildingListScreen from '../screens/BuildingListScreen';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('BuildingListScreen', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<BuildingListScreen />, { wrapper: createWrapper() });
    expect(getByText('Add Building')).toBeTruthy();
  });
});
