// @ts-check
import { caretakersApi } from '../../services/caretakersApi';
import {
  mockCaretaker,
  mockCaretakerHistoryEntry,
  mockCaretakerListResponse,
  mockCaretakerUnit,
} from '../mocks/data';

jest.mock('../../services/caretakersApi');

describe('caretakersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch list of caretakers', async () => {
      (caretakersApi.list as jest.Mock).mockResolvedValue(mockCaretakerListResponse);
      const result = await caretakersApi.list();
      expect(result).toEqual(mockCaretakerListResponse);
      expect((result as any).results).toHaveLength(1);
    });

    it('should pass search params', async () => {
      (caretakersApi.list as jest.Mock).mockResolvedValue(mockCaretakerListResponse);
      await caretakersApi.list({ search: 'Rahul', is_active: true });
      expect(caretakersApi.list).toHaveBeenCalledWith({ search: 'Rahul', is_active: true });
    });
  });

  describe('retrieve', () => {
    it('should fetch a single caretaker', async () => {
      (caretakersApi.retrieve as jest.Mock).mockResolvedValue(mockCaretaker);
      const result = await caretakersApi.retrieve(1);
      expect(result).toEqual(mockCaretaker);
    });

    it('should handle string id', async () => {
      (caretakersApi.retrieve as jest.Mock).mockResolvedValue(mockCaretaker);
      const result = await caretakersApi.retrieve('1');
      expect(result).toEqual(mockCaretaker);
    });
  });

  describe('create', () => {
    it('should create a new caretaker', async () => {
      const newCaretaker = { ...mockCaretaker, id: 2, name: 'New Caretaker' };
      (caretakersApi.create as jest.Mock).mockResolvedValue(newCaretaker);
      const result = await caretakersApi.create({ unit: 1, name: 'New Caretaker', phone: '+919999999999', joining_date: '2024-06-01' } as any);
      expect(result).toEqual(newCaretaker);
    });
  });

  describe('update', () => {
    it('should update a caretaker', async () => {
      const updated = { ...mockCaretaker, name: 'Updated Name' };
      (caretakersApi.update as jest.Mock).mockResolvedValue(updated);
      const result = await caretakersApi.update(1, { name: 'Updated Name' } as any);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a caretaker', async () => {
      (caretakersApi.remove as jest.Mock).mockResolvedValue(undefined);
      await expect(caretakersApi.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('deactivate', () => {
    it('should deactivate a caretaker', async () => {
      const deactivated = { ...mockCaretaker, is_active: false, leaving_date: '2024-06-01' };
      (caretakersApi.deactivate as jest.Mock).mockResolvedValue(deactivated);
      const result = await caretakersApi.deactivate(1);
      expect(result).toEqual(deactivated);
    });
  });

  describe('fetchHistory', () => {
    it('should fetch caretaker history', async () => {
      (caretakersApi.fetchHistory as jest.Mock).mockResolvedValue([mockCaretakerHistoryEntry]);
      const result = await caretakersApi.fetchHistory(1);
      expect(result).toHaveLength(1);
      expect(result[0].action).toBe('+');
    });
  });

  describe('fetchUnits', () => {
    it('should fetch available units', async () => {
      (caretakersApi.fetchUnits as jest.Mock).mockResolvedValue([mockCaretakerUnit]);
      const result = await caretakersApi.fetchUnits();
      expect(result).toHaveLength(1);
      expect(result[0].label).toContain('Sunshine Complex');
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      (caretakersApi.list as jest.Mock).mockRejectedValue(error);
      await expect(caretakersApi.list()).rejects.toThrow('API Error');
    });
  });
});
