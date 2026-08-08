// @ts-nocheck
import { renderHook } from '@testing-library/react-native';
import { act } from '@testing-library/react-native';
import { useAIChat } from '../hooks/useAIChat';
import { useAIAssistantStore } from '../store';
import { aiAssistantService } from '../services';

jest.mock('../services');

describe('useAIChat', () => {
  beforeEach(() => {
    useAIAssistantStore.getState().reset();
    jest.clearAllMocks();
  });

  it('sends message and updates store', async () => {
    const mockResponse = {
      conversation_id: 'conv-1',
      response: {
        response: 'Test response',
        tools_used: [],
        data: {},
        sources: [],
        timestamp: new Date().toISOString(),
      },
    };

    (aiAssistantService.sendMessage as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAIChat(), {
      wrapper: ({ children }: { children: React.ReactNode }) => children,
    });

    await act(async () => {
      await result.current.sendMessage({ message: 'Test message', conversationId: null });
    });

    const messages = useAIAssistantStore.getState().messages;
    expect(messages.length).toBeGreaterThanOrEqual(2);
    expect(messages[0].content).toBe('Test message');
    expect(messages[0].role).toBe('user');
  });

  it('handles error when message fails', async () => {
    (aiAssistantService.sendMessage as jest.Mock).mockRejectedValue({
      error_code: 'network_error',
      message: 'Network error',
    });

    const { result } = renderHook(() => useAIChat(), {
      wrapper: ({ children }: { children: React.ReactNode }) => children,
    });

    await act(async () => {
      await result.current.sendMessage({ message: 'Test message', conversationId: null }).catch(() => {});
    });

    const error = useAIAssistantStore.getState().error;
    expect(error).toBe('Network error');
  });
});
