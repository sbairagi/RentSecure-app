import { mmkvStorage } from '@/services/storage/mmkv';
import { DEFAULT_LANGUAGE, isSupportedLanguage, type SupportedLanguage } from '@/localization/constants/languages';
import { create } from 'zustand';

export type Language = SupportedLanguage;

interface LanguageState {
  language: Language;
}

interface LanguageActions {
  setLanguage: (language: Language) => Promise<void>;
  initLanguage: () => Promise<void>;
}

type LanguageStore = LanguageState & LanguageActions;

function getDeviceLocale(): SupportedLanguage {
  if (typeof globalThis !== 'undefined' && (globalThis as any).navigator) {
    const locale = (globalThis as any).navigator.language || (globalThis as any).navigator.userLanguage || 'en';
    const lang = locale.toLowerCase().split('-')[0] as string;
    if (isSupportedLanguage(lang)) {
      return lang;
    }
  }
  return DEFAULT_LANGUAGE;
}

export const useLanguageStore = create<LanguageStore>((set, _get) => ({
  language: DEFAULT_LANGUAGE,

  setLanguage: async (language) => {
    await mmkvStorage.setItem('app_language', language);
    set({ language });
  },

  initLanguage: async () => {
    const stored = await mmkvStorage.getItem('app_language');
    if (stored && isSupportedLanguage(stored)) {
      set({ language: stored });
    } else {
      const deviceLocale = getDeviceLocale();
      await mmkvStorage.setItem('app_language', deviceLocale);
      set({ language: deviceLocale });
    }
  },
}));
