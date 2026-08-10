import { secureStorage } from '@/services/storage/secureStorage';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
}));

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('SecureStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem / getItem', () => {
    it('should store and retrieve items', async () => {
      await secureStorage.setItem('test_key', 'test_value');
      const result = await secureStorage.getItem('test_key');
      expect(result).toBe('test_value');
    });
  });

  describe('removeItem', () => {
    it('should remove items', async () => {
      await secureStorage.setItem('test_key', 'test_value');
      await secureStorage.removeItem('test_key');
      const result = await secureStorage.getItem('test_key');
      expect(result).toBeNull();
    });
  });

  describe('token operations', () => {
    it('should store and retrieve access token', async () => {
      await secureStorage.setAccessToken('test_access_token');
      const result = await secureStorage.getAccessToken();
      expect(result).toBe('test_access_token');
    });

    it('should store and retrieve refresh token', async () => {
      await secureStorage.setRefreshToken('test_refresh_token');
      const result = await secureStorage.getRefreshToken();
      expect(result).toBe('test_refresh_token');
    });
  });

  describe('user operations', () => {
    it('should store and retrieve user object', async () => {
      const user = { id: '1', name: 'Test User', role: 'renter' };
      await secureStorage.setUser(JSON.stringify(user));
      const result = await secureStorage.getUser<typeof user>();
      expect(result).toEqual(user);
    });

    it('should return null for invalid JSON', async () => {
      await secureStorage.setItem('auth_user', 'invalid json');
      const result = await secureStorage.getUser<any>();
      expect(result).toBeNull();
    });
  });

  describe('session operations', () => {
    it('should store and retrieve session expiry', async () => {
      const expiry = Date.now() + 100000;
      await secureStorage.setSessionExpiry(expiry);
      const result = await secureStorage.getSessionExpiry();
      expect(result).toBe(expiry);
    });

    it('should store and retrieve last activity', async () => {
      const activity = Date.now();
      await secureStorage.setLastActivity(activity);
      const result = await secureStorage.getLastActivity();
      expect(result).toBe(activity);
    });
  });

  describe('clearAuth', () => {
    it('should clear all auth data', async () => {
      await secureStorage.setAccessToken('access');
      await secureStorage.setRefreshToken('refresh');
      await secureStorage.setUser(JSON.stringify({ id: '1' }));
      await secureStorage.setSessionExpiry(Date.now());
      await secureStorage.setLastActivity(Date.now());

      await secureStorage.clearAuth();

      expect(await secureStorage.getAccessToken()).toBeNull();
      expect(await secureStorage.getRefreshToken()).toBeNull();
      expect(await secureStorage.getUser()).toBeNull();
      expect(await secureStorage.getSessionExpiry()).toBeNull();
      expect(await secureStorage.getLastActivity()).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear all stored data', async () => {
      await secureStorage.setItem('other_key', 'value');
      await secureStorage.clearAll();
      const result = await secureStorage.getItem('other_key');
      expect(result).toBeNull();
    });
  });
});
