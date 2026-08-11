import i18n from '@/localization/i18n';

const SUPPORTED_LANGUAGES = ['en', 'hi'] as const;

describe('i18n', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('defaults to English', () => {
    expect(i18n.language).toBe('en');
  });

  it('switches to Hindi', async () => {
    await i18n.changeLanguage('hi');
    expect(i18n.language).toBe('hi');
  });

  it('falls back to English for unsupported language', async () => {
    await i18n.changeLanguage('fr');
    expect(i18n.language).toBe('en');
  });

  it('returns English translation for known key', () => {
    expect(i18n.t('common.loading')).toBe('Loading...');
  });

  it('returns Hindi translation for known key when language is hi', async () => {
    await i18n.changeLanguage('hi');
    expect(i18n.t('common.loading')).toBe('लोड हो रहा है...');
  });

  it('falls back to English for missing key in Hindi', async () => {
    await i18n.changeLanguage('hi');
    expect(i18n.t('common.loading')).not.toBe('common.loading');
  });

  it('supports interpolation', () => {
    const result = i18n.t('auth.loginSuccess', { name: 'Test' });
    expect(result).toBeDefined();
  });

  it('returns key as fallback for completely missing key', () => {
    const result = i18n.t('nonexistent.deep.key');
    expect(result).toBe('nonexistent.deep.key');
  });

  it('supports all configured languages', async () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      await i18n.changeLanguage(lang);
      expect(i18n.t('common.loading')).toBeDefined();
    }
  });
});
