import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

export const mmkvStorage = {
  async getItem(key: string): Promise<string | null> {
    const value = mmkv.getString(key);
    return value ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    mmkv.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    mmkv.delete(key);
  },
};
