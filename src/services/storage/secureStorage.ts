import * as SecureStore from 'expo-secure-store';

const SECURE_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'language',
} as const;

class SecureStorageService {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`SecureStore setItem error [${key}]:`, error);
      throw new Error(`Failed to store item: ${key}`);
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`SecureStore getItem error [${key}]:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`SecureStore removeItem error [${key}]:`, error);
      throw new Error(`Failed to remove item: ${key}`);
    }
  }

  async setAccessToken(token: string): Promise<void> {
    await this.setItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  async getAccessToken(): Promise<string | null> {
    return this.getItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.setItem(SECURE_STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.getItem(SECURE_STORAGE_KEYS.REFRESH_TOKEN);
  }

  async setUser(user: string): Promise<void> {
    await this.setItem(SECURE_STORAGE_KEYS.USER, user);
  }

  async getUser<T>(): Promise<T | null> {
    const userStr = await this.getItem(SECURE_STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as T;
    } catch {
      return null;
    }
  }

  async setThemePreference(theme: string): Promise<void> {
    await this.setItem(SECURE_STORAGE_KEYS.THEME_PREFERENCE, theme);
  }

  async getThemePreference(): Promise<string | null> {
    return this.getItem(SECURE_STORAGE_KEYS.THEME_PREFERENCE);
  }

  async setLanguage(language: string): Promise<void> {
    await this.setItem(SECURE_STORAGE_KEYS.LANGUAGE, language);
  }

  async getLanguage(): Promise<string | null> {
    return this.getItem(SECURE_STORAGE_KEYS.LANGUAGE);
  }

  async clearAuth(): Promise<void> {
    await Promise.all([
      this.removeItem(SECURE_STORAGE_KEYS.ACCESS_TOKEN),
      this.removeItem(SECURE_STORAGE_KEYS.REFRESH_TOKEN),
      this.removeItem(SECURE_STORAGE_KEYS.USER),
    ]);
  }

  async clearAll(): Promise<void> {
    await Promise.all(Object.values(SECURE_STORAGE_KEYS).map((key) => this.removeItem(key)));
  }
}

export const secureStorage = new SecureStorageService();
export { SECURE_STORAGE_KEYS };
