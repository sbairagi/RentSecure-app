// @ts-nocheck
import { aiAssistantService } from '../services';

jest.mock('../services');

describe('AIAssistantService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendMessage calls service with correct data', async () => {
    const mockResponse = {
      conversation_id: 'conv-1',
      response: {
        response: 'Test response',
        tools_used: ['get_pending_rents'],
        data: { total_pending: 1000 },
        sources: ['RentRecord'],
        timestamp: new Date().toISOString(),
      },
    };

    (aiAssistantService.sendMessage as jest.Mock).mockResolvedValue(mockResponse);

    const result = await aiAssistantService.sendMessage('Test', 'conv-1');

    expect(result.conversationId).toBe('conv-1');
    expect(result.response.response).toBe('Test response');
  });

  it('loadSuggestedQuestions returns empty array on error', async () => {
    (aiAssistantService.loadSuggestedQuestions as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const result = await aiAssistantService.loadSuggestedQuestions();
    expect(result).toEqual([]);
  });
});
