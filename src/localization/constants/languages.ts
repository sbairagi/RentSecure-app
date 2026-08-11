export type SupportedLanguage = 'en' | 'hi';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: readonly LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
  },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

export const LANGUAGE_CODE_MAP: Readonly<Record<SupportedLanguage, string>> = {
  en: 'en-US',
  hi: 'hi-IN',
};

export function getLanguageConfig(code: string): LanguageConfig | undefined {
  return LANGUAGES.find((lang) => lang.code === code);
}

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return LANGUAGES.some((lang) => lang.code === code);
}
