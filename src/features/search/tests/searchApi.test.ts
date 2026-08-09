// @ts-nocheck
import { searchApi } from '../services/searchApi';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';

jest.mock('@/services/api/apiClient');

const mockApiService = require('@/services/api/apiClient').apiService as jest.Mocked<any>;

describe('searchApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('calls correct endpoint with query', async () => {
      const mockResponse = {
        query: 'building',
        total_results: 5,
        page: 1,
        page_size: 20,
        total_pages: 1,
        results: [],
        available_resource_types: ['buildings'],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await searchApi.search('building');

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${SEARCH_CONSTANTS.API.GLOBAL_SEARCH}?q=building`
      );
      expect(result).toEqual(mockResponse);
    });

    it('includes filters in query params', async () => {
      const mockResponse = {
        query: 'building',
        total_results: 5,
        page: 1,
        page_size: 20,
        total_pages: 1,
        results: [],
        available_resource_types: ['buildings', 'units'],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      await searchApi.search('building', {
        resource_type: 'buildings,units',
        ordering: 'newest',
        page: 2,
        page_size: 10,
      });

      expect(mockApiService.get).toHaveBeenCalledWith(
        expect.stringContaining('resource_type=buildings%2Cunits')
      );
      expect(mockApiService.get).toHaveBeenCalledWith(
        expect.stringContaining('ordering=newest')
      );
      expect(mockApiService.get).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      );
    });

    it('handles empty query', async () => {
      const mockResponse = {
        query: '',
        total_results: 0,
        page: 1,
        page_size: 20,
        total_pages: 0,
        results: [],
        available_resource_types: [],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      await searchApi.search('');

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${SEARCH_CONSTANTS.API.GLOBAL_SEARCH}`
      );
    });

    it('propagates API errors', async () => {
      mockApiService.get.mockRejectedValue(new Error('Network Error'));

      await expect(searchApi.search('test')).rejects.toThrow('Network Error');
    });
  });

  describe('getSuggestions', () => {
    it('calls correct endpoint with query', async () => {
      const mockResponse = {
        query: 'bui',
        suggestions: ['building', 'building name'],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await searchApi.getSuggestions('bui');

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${SEARCH_CONSTANTS.API.SUGGESTIONS}?q=bui&limit=10`
      );
      expect(result).toEqual(mockResponse);
    });

    it('uses custom limit', async () => {
      const mockResponse = {
        query: 'bui',
        suggestions: ['building'],
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      await searchApi.getSuggestions('bui', 5);

      expect(mockApiService.get).toHaveBeenCalledWith(
        `${SEARCH_CONSTANTS.API.SUGGESTIONS}?q=bui&limit=5`
      );
    });

    it('propagates API errors', async () => {
      mockApiService.get.mockRejectedValue(new Error('Server Error'));

      await expect(searchApi.getSuggestions('test')).rejects.toThrow('Server Error');
    });
  });
});
