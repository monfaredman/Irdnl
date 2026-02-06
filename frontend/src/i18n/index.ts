import fa from './fa.json';

export type TranslationKey = keyof typeof fa.admin;

export const translations = {
  fa,
};

export function useTranslation() {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = fa;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t };
}
