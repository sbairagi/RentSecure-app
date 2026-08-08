// @ts-nocheck
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AIAssistantScreen } from '../screens/AIAssistantScreen';
import { useAIAssistantStore } from '../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('AIAssistantScreen', () => {
  beforeEach(() => {
    useAIAssistantStore.getState().reset();
    queryClient.clear();
  });

  it('renders empty state when no messages', () => {
    const { getByText } = render(<AIAssistantScreen />, { wrapper });
    expect(getByText('AI Assistant')).toBeTruthy();
  });

  it('shows suggested questions when empty', async () => {
    const { getByText } = render(<AIAssistantScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('Suggested questions')).toBeTruthy();
    });
  });

  it('shows typing indicator when loading', async () => {
    useAIAssistantStore.getState().setTyping(true);
    const { getByText } = render(<AIAssistantScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('AI is thinking')).toBeTruthy();
    });
  });

  it('shows error state when error exists', async () => {
    useAIAssistantStore.getState().setError('Test error', 'unknown');
    const { getByText } = render(<AIAssistantScreen />, { wrapper });
    await waitFor(() => {
      expect(getByText('Test error')).toBeTruthy();
    });
  });
});
