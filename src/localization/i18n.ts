import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/common.json';
import hi from './hi/common.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

const SUPPORTED_LANGUAGES = ['en', 'hi'] as const;

function getDeviceLocale(): string {
  if (typeof globalThis !== 'undefined' && (globalThis as any).navigator) {
    const locale = (globalThis as any).navigator.language || (globalThis as any).navigator.userLanguage || 'en';
    const lang = locale.toLowerCase().split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang;
    }
  }
  return 'en';
}

const storedLanguage = typeof localStorage !== 'undefined' ? localStorage.getItem('app_language') : null;

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage || getDeviceLocale(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  saveMissing: __DEV__,
  missingKeyHandler: __DEV__
    ? (lng, ns, key, _fallbackValue) => {
        console.warn(`[i18n] Missing translation key: "${key}" in namespace "${ns}" for language "${lng}"`);
      }
    : undefined,
  parseMissingKeyHandler: __DEV__
    ? (key, _fallbackValue) => {
        console.warn(`[i18n] Missing translation key: "${key}"`);
      }
    : undefined,
});

export default i18n;
