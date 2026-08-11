import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type TranslationKeys = {
  app: { name: string; tagline: string };
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    back: string;
    next: string;
    submit: string;
    close: string;
    yes: string;
    no: string;
    ok: string;
    confirm: string;
    skip: string;
    learnMore: string;
    seeAll: string;
    noData: string;
    somethingWentWrong: string;
    noInternet: string;
    checkingInternet: string;
    sessionExpired: string;
    unauthorized: string;
  };
};

export const useAppTranslation = () => {
  const { t } = useTranslation();

  const interpolate = useMemo(
    () =>
      (key: string, values?: Record<string, any>): string => {
        return t(key, values);
      },
    [t]
  );

  return { t, interpolate };
};

export type { TranslationKeys };
