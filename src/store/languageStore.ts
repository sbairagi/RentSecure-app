import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';

export type Language = 'en' | 'hi';

interface LanguageState {
  language: Language;
}

interface LanguageActions {
  setLanguage: (language: Language) => Promise<void>;
  initLanguage: () => Promise<void>;
}

type LanguageStore = LanguageState & LanguageActions;

export const useLanguageStore = create<LanguageStore>((set, _get) => ({
  language: 'en',

  setLanguage: async (language) => {
    await mmkvStorage.setItem('app_language', language);
    set({ language });
  },

  initLanguage: async () => {
    const stored = await mmkvStorage.getItem('app_language');
    if (stored === 'en' || stored === 'hi') {
      set({ language: stored });
    }
  },
}));
